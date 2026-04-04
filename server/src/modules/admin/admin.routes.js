const { Router } = require('express');
const adminController = require('./admin.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorize } = require('../../shared/middlewares/role.middleware');

const router = Router();

// Secure all admin routes
router.use(authenticate);
router.use(authorize('admin')); // Assuming role 'admin' exists in ROLES

/** GET /api/admin/stats */
router.get('/stats', adminController.getStats);

/** GET /api/admin/users */
router.get('/users', adminController.getUsers);

/** GET /api/admin/orders */
router.get('/orders', adminController.getOrders);

/** GET /api/admin/trades */
router.get('/trades', adminController.getTrades);

module.exports = router;
