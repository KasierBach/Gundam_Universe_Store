const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');
const ApiError = require('../../shared/utils/ApiError');
const userRepository = require('../user/user.repository');
const User = require('../user/user.model');

class AuthService {
  /**
   * Generate access + refresh token pair
   * @param {string} userId
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   */
  async register({ email, password, displayName }) {
    const existingUser = await userRepository.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await userRepository.create({ email, password, displayName });
    const tokens = this.generateTokens(user._id);

    await userRepository.addRefreshToken(user._id, tokens.refreshToken);
    await userRepository.updateById(user._id, { lastLogin: new Date() });

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Login with email & password
   */
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account has been deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this.generateTokens(user._id);
    await userRepository.addRefreshToken(user._id, tokens.refreshToken);
    await userRepository.updateById(user._id, { lastLogin: new Date() });

    // Strip password from response
    const userObj = user.toJSON();

    return {
      user: userObj,
      ...tokens,
    };
  }

  /**
   * Logout - remove refresh token
   */
  async logout(userId, refreshToken) {
    if (refreshToken) {
      await userRepository.removeRefreshToken(userId, refreshToken);
    }
  }

  /**
   * Refresh access token using valid refresh token
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (_error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository.findByIdWithTokens(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      // Possible token reuse attack - clear all tokens
      await userRepository.clearRefreshTokens(user._id);
      throw ApiError.unauthorized('Token reuse detected. All sessions revoked.');
    }

    // Rotate refresh token
    await userRepository.removeRefreshToken(user._id, refreshToken);
    const tokens = this.generateTokens(user._id);
    await userRepository.addRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) throw ApiError.notFound('User not found');

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) throw ApiError.badRequest('Current password is incorrect');

    user.password = newPassword;
    await user.save();

    // Clear all refresh tokens (force re-login on other devices)
    await userRepository.clearRefreshTokens(userId);
  }

  /**
   * Forgot password - generates reset token
   * NOTE: In production, this would send an email. For demo, returns the token.
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    const response = {
      message: 'If an account exists, a reset link has been sent.',
    };

    if (env.isDevelopment()) {
      response.resetToken = resetToken;
    }

    return response;
  }

  /**
   * Reset password using reset token
   */
  async resetPassword({ token, newPassword }) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await userRepository.clearRefreshTokens(user._id);

    return { message: 'Password reset successfully. Please login with your new password.' };
  }
}

module.exports = new AuthService();
