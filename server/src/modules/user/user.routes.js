const { Router } = require('express');
const userController = require('./user.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { uploadSingle } = require('../../shared/middlewares/upload.middleware');
const { updateProfileSchema } = require('./user.validator');

const router = Router();

// Protected routes
router.get('/me', authenticate, userController.getMe);
router.get('/discover', authenticate, userController.discoverUsers);
router.put('/me', authenticate, validate(updateProfileSchema), userController.updateMe);
router.put('/me/avatar', authenticate, uploadSingle, userController.updateAvatar);

// Public routes
router.get('/:id', userController.getPublicProfile);

module.exports = router;
