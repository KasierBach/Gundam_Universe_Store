const { Router } = require('express');
const orderController = require('./order.controller');
const { authenticate, authorize } = require('../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Public (to logged in pilot) routes
router.post('/checkout', (req, res, next) => orderController.create(req, res, next));
router.get('/history', (req, res, next) => orderController.getHistory(req, res, next));
router.get('/:id', (req, res, next) => orderController.getById(req, res, next));

// Admin only routes
router.patch(
  '/:id/status', 
  authorize(ROLES.ADMIN), 
  (req, res, next) => orderController.updateStatus(req, res, next)
);

module.exports = router;
