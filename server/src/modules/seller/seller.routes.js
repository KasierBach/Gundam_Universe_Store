const { Router } = require('express');
const sellerController = require('./seller.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorize } = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/constants/roles');

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.SELLER, ROLES.ADMIN));

router.get('/dashboard', sellerController.getDashboard);

module.exports = router;
