const { Router } = require('express');
const categoryController = require('./category.controller');
const { authenticate, authorize } = require('../../shared/middlewares/auth.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { ROLES } = require('../../shared/constants/roles');
const { categorySchema, updateCategorySchema } = require('./category.validator');

const router = Router();

// Public routes
router.get('/', (req, res, next) => categoryController.getActive(req, res, next));
router.get('/all', authenticate, authorize(ROLES.ADMIN, ROLES.SELLER), (req, res, next) => categoryController.getAll(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getById(req, res, next));

// Admin routes
router.post(
  '/', 
  authenticate, 
  authorize(ROLES.ADMIN), 
  validate(categorySchema), 
  (req, res, next) => categoryController.create(req, res, next)
);

router.put(
  '/:id', 
  authenticate, 
  authorize(ROLES.ADMIN), 
  validate(updateCategorySchema), 
  (req, res, next) => categoryController.update(req, res, next)
);

router.delete(
  '/:id', 
  authenticate, 
  authorize(ROLES.ADMIN), 
  (req, res, next) => categoryController.delete(req, res, next)
);

router.patch(
  '/:id/status', 
  authenticate, 
  authorize(ROLES.ADMIN), 
  (req, res, next) => categoryController.toggleStatus(req, res, next)
);

module.exports = router;
