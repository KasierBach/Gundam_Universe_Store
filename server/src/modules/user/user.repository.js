const BaseRepository = require('../../shared/base/BaseRepository');
const User = require('./user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email }).select('+password');
  }

  async findByIdWithPassword(id) {
    return this.model.findById(id).select('+password');
  }

  async findByIdWithTokens(id) {
    return this.model.findById(id).select('+refreshTokens');
  }

  async updateReputation(userId, ratingDelta) {
    return this.model.findByIdAndUpdate(
      userId,
      {
        $inc: {
          'reputation.score': ratingDelta,
          'reputation.totalRatings': 1,
        },
      },
      { new: true }
    );
  }

  async addRefreshToken(userId, token) {
    return this.model.findByIdAndUpdate(userId, {
      $push: { refreshTokens: token },
    });
  }

  async removeRefreshToken(userId, token) {
    return this.model.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
  }

  async clearRefreshTokens(userId) {
    return this.model.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }

  async searchDirectory(query = '', currentUserId, limit = 8) {
    const normalizedQuery = query.trim();
    const filter = {
      _id: { $ne: currentUserId },
      isActive: true,
    };

    if (normalizedQuery) {
      filter.$or = [
        { displayName: { $regex: normalizedQuery, $options: 'i' } },
        { email: { $regex: normalizedQuery, $options: 'i' } },
        { role: { $regex: normalizedQuery, $options: 'i' } },
        { 'address.city': { $regex: normalizedQuery, $options: 'i' } },
      ];
    }

    return this.model.find(filter)
      .select('displayName email avatar role reputation address phone')
      .sort({ 'reputation.score': -1, displayName: 1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new UserRepository();
