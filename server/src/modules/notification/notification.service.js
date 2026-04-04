const notificationRepository = require('./notification.repository');
const { NOTIFICATION_TYPES } = require('./notification.model');
const ApiError = require('../../shared/utils/ApiError');
const { getIO } = require('../../config/socket');

class NotificationService {
  async createNotification(payload) {
    const notification = await notificationRepository.create(payload);

    try {
      const io = getIO();
      io.to(payload.user.toString()).emit('notification_created', notification);
    } catch (_error) {
      // Socket server may not be initialized in non-runtime contexts.
    }

    return notification;
  }

  async getUserNotifications(userId, limit) {
    const [items, unreadCount] = await Promise.all([
      notificationRepository.findByUserId(userId, limit),
      notificationRepository.countUnread(userId),
    ]);

    return { items, unreadCount };
  }

  async markAsRead(notificationId, userId) {
    const notification = await notificationRepository.markAsRead(notificationId, userId);
    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId) {
    await notificationRepository.markAllAsRead(userId);
    return this.getUserNotifications(userId);
  }
}

NotificationService.NOTIFICATION_TYPES = NOTIFICATION_TYPES;

module.exports = new NotificationService();
