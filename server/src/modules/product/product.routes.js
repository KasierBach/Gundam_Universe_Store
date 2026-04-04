const { Router } = require('express');
const productController = require('./product.controller');
const { authenticate, authorize } = require('../../shared/middlewares/auth.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { ROLES } = require('../../shared/constants/roles');
const {
  productSchema,
  updateProductSchema,
  queryProductSchema,
  recommendationParamsSchema,
} = require('./product.validator');

const router = Router();

// Public routes
router.get('/', validate(queryProductSchema), (req, res, next) => productController.query(req, res, next));
router.get('/:slug/recommendations', validate(recommendationParamsSchema), (req, res, next) => productController.getRecommendations(req, res, next));
router.get('/:slug', (req, res, next) => productController.getBySlug(req, res, next));

// Seller and Admin routes
router.post(
  '/', 
  authenticate, 
  authorize(ROLES.ADMIN, ROLES.SELLER), 
  validate(productSchema), 
  (req, res, next) => productController.create(req, res, next)
);

router.put(
  '/:id', 
  authenticate, 
  authorize(ROLES.ADMIN, ROLES.SELLER), 
  validate(updateProductSchema), 
  (req, res, next) => productController.update(req, res, next)
);

router.delete(
  '/:id', 
  authenticate, 
  authorize(ROLES.ADMIN, ROLES.SELLER), 
  (req, res, next) => productController.delete(req, res, next)
);

module.exports = router;
