const notificationService = require('./notification.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class NotificationController {
  getMyNotifications = asyncHandler(async (req, res) => {
    const data = await notificationService.getUserNotifications(req.user._id, Number(req.query.limit) || 30);
    res.status(200).json(ApiResponse.success(data, 'Notifications retrieved successfully'));
  });

  markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.status(200).json(ApiResponse.success(notification, 'Notification marked as read'));
  });

  markAllAsRead = asyncHandler(async (req, res) => {
    const data = await notificationService.markAllAsRead(req.user._id);
    res.status(200).json(ApiResponse.success(data, 'All notifications marked as read'));
  });
}

module.exports = new NotificationController();
