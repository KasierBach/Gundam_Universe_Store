const { Notification } = require('./notification.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findByUserId(userId, limit = 30) {
    return this.model.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async markAsRead(notificationId, userId) {
    return this.model.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return this.model.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async countUnread(userId) {
    return this.model.countDocuments({ user: userId, isRead: false });
  }
}

module.exports = new NotificationRepository();
