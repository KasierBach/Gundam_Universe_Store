const { Router } = require('express');
const notificationController = require('./notification.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const {
  queryNotificationsSchema,
  notificationIdParamsSchema,
} = require('./notification.validator');

const router = Router();

router.use(authenticate);

router.get('/', validate(queryNotificationsSchema), notificationController.getMyNotifications);
router.patch('/:id/read', validate(notificationIdParamsSchema), notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

module.exports = router;
