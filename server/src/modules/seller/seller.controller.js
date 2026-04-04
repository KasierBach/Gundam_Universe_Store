const sellerService = require('./seller.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class SellerController {
  getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await sellerService.getDashboard(req.user._id);
    res.status(200).json(ApiResponse.success(dashboard, 'Seller dashboard retrieved successfully'));
  });
}

module.exports = new SellerController();
