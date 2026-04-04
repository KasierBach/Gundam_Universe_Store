const { Router } = require('express');
const sellerController = require('./seller.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorize } = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/constants/roles');
const { validate } = require('../../shared/middlewares/validate.middleware');
const {
  sellerProductUpdateSchema,
  sellerOrderUpdateSchema,
} = require('./seller.validator');

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.SELLER, ROLES.ADMIN));

router.get('/dashboard', sellerController.getDashboard);
router.get('/products', sellerController.getProducts);
router.patch('/products/:id', validate(sellerProductUpdateSchema), sellerController.updateProduct);
router.get('/orders', sellerController.getOrders);
router.patch('/orders/:id/status', validate(sellerOrderUpdateSchema), sellerController.updateOrderStatus);

module.exports = router;
