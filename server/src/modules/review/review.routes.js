const { Router } = require('express');
const reviewController = require('./review.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// Public routes
router.get('/product/:productId', (req, res, next) => reviewController.getByProduct(req, res, next));

// Private routes
router.post('/', authenticate, (req, res, next) => reviewController.create(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => reviewController.remove(req, res, next));

module.exports = router;
