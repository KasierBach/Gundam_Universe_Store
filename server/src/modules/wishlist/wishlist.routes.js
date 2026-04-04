const { Router } = require('express');
const wishlistController = require('./wishlist.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { validate } = require('../../shared/middlewares/validate.middleware');
const {
  addWishlistProductSchema,
  wishlistProductParamsSchema,
} = require('./wishlist.validator');

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/items', validate(addWishlistProductSchema), wishlistController.addProduct);
router.delete('/items/:productId', validate(wishlistProductParamsSchema), wishlistController.removeProduct);
router.delete('/clear', wishlistController.clearWishlist);

module.exports = router;
