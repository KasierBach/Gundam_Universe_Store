const BaseController = require('../../shared/base/BaseController');
const authService = require('./auth.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class AuthController extends BaseController {
  constructor() {
    super(authService);
  }

  /** POST /api/auth/register */
  register = this.handler(async (req, res) => {
    const { email, password, displayName } = req.body;
    const result = await authService.register({ email, password, displayName });
    ApiResponse.created(result, 'Registration successful').send(res);
  });

  /** POST /api/auth/login */
  login = this.handler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    ApiResponse.success(result, 'Login successful').send(res);
  });

  /** POST /api/auth/logout */
  logout = this.handler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(req.user._id, refreshToken);
    ApiResponse.success(null, 'Logged out successfully').send(res);
  });

  /** POST /api/auth/refresh-token */
  refreshToken = this.handler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    ApiResponse.success(tokens, 'Token refreshed').send(res);
  });

  /** PUT /api/auth/change-password */
  changePassword = this.handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, { currentPassword, newPassword });
    ApiResponse.success(null, 'Password changed. Please login again.').send(res);
  });

  /** POST /api/auth/forgot-password */
  forgotPassword = this.handler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    ApiResponse.success(result).send(res);
  });

  /** POST /api/auth/reset-password */
  resetPassword = this.handler(async (req, res) => {
    const result = await authService.resetPassword(req.body);
    ApiResponse.success(result).send(res);
  });
}

module.exports = new AuthController();
