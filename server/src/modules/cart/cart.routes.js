const { Router } = require('express');
const cartController = require('./cart.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', (req, res, next) => cartController.get(req, res, next));
router.post('/add', (req, res, next) => cartController.add(req, res, next));
router.put('/update', (req, res, next) => cartController.updateItem(req, res, next));
router.delete('/item/:productId', (req, res, next) => cartController.removeItem(req, res, next));
router.delete('/clear', (req, res, next) => cartController.clearAll(req, res, next));

module.exports = router;
