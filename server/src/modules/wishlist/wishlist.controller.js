const wishlistService = require('./wishlist.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class WishlistController {
  getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user._id);
    res.status(200).json(ApiResponse.success(wishlist, 'Wishlist retrieved successfully'));
  });

  addProduct = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.addProduct(req.user._id, req.body.productId);
    res.status(200).json(ApiResponse.success(wishlist, 'Product added to wishlist'));
  });

  removeProduct = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.removeProduct(req.user._id, req.params.productId);
    res.status(200).json(ApiResponse.success(wishlist, 'Product removed from wishlist'));
  });

  clearWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.clearWishlist(req.user._id);
    res.status(200).json(ApiResponse.success(wishlist, 'Wishlist cleared successfully'));
  });
}

module.exports = new WishlistController();
