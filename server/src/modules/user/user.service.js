const BaseService = require('../../shared/base/BaseService');
const userRepository = require('./user.repository');
const ApiError = require('../../shared/utils/ApiError');
const cloudinary = require('../../config/cloudinary');

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  async getProfile(userId) {
    const user = await this.repository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async getPublicProfile(userId) {
    const user = await this.repository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    // Return only public fields
    const { password, refreshTokens, ...publicData } = user;
    return publicData;
  }

  async updateProfile(userId, updateData) {
    const user = await this.repository.updateById(userId, updateData);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateAvatar(userId, file) {
    const user = await this.repository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
    }

    // Upload new avatar
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gundam-universe/avatars',
          transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });

    return this.repository.updateById(userId, {
      avatar: { url: result.secure_url, publicId: result.public_id },
    });
  }
}

module.exports = new UserService();
