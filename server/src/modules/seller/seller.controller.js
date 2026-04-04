const sellerService = require('./seller.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class SellerController {
  getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await sellerService.getDashboard(req.user._id);
    res.status(200).json(ApiResponse.success(dashboard, 'Seller dashboard retrieved successfully'));
  });

  getProducts = asyncHandler(async (req, res) => {
    const products = await sellerService.getProducts(req.user._id);
    res.status(200).json(ApiResponse.success(products, 'Seller products retrieved successfully'));
  });

  updateProduct = asyncHandler(async (req, res) => {
    const product = await sellerService.updateProduct(req.params.id, req.user._id, req.body);
    res.status(200).json(ApiResponse.success(product, 'Seller product updated successfully'));
  });

  getOrders = asyncHandler(async (req, res) => {
    const orders = await sellerService.getOrders(req.user._id);
    res.status(200).json(ApiResponse.success(orders, 'Seller orders retrieved successfully'));
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await sellerService.updateOrderStatus(req.params.id, req.user._id, req.body.status);
    res.status(200).json(ApiResponse.success(order, 'Seller order status updated successfully'));
  });
}

module.exports = new SellerController();
