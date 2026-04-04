const mongoose = require('mongoose');
const Product = require('../product/product.model');
const Order = require('../order/order.model');
const TradeListing = require('../trade/tradeListing.model');

class SellerRepository {
  async getProductStats(sellerId) {
    const [stats] = await Product.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
            },
          },
          totalStock: { $sum: '$stock' },
        },
      },
    ]);

    return stats || {
      totalProducts: 0,
      activeProducts: 0,
      totalStock: 0,
    };
  }

  async getSalesStats(sellerId) {
    const [stats] = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          soldUnits: { $sum: '$items.quantity' },
          orderIds: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          soldUnits: 1,
          totalOrders: { $size: '$orderIds' },
        },
      },
    ]);

    return stats || {
      totalRevenue: 0,
      soldUnits: 0,
      totalOrders: 0,
    };
  }

  async getTopProducts(sellerId, limit = 5) {
    return Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          soldUnits: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { soldUnits: -1, revenue: -1 } },
      { $limit: limit },
    ]);
  }

  async getRecentOrders(sellerId, limit = 8) {
    return Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          status: { $first: '$status' },
          user: { $first: '$user' },
          shippingAddress: { $first: '$shippingAddress' },
          sellerRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          items: {
            $push: {
              name: '$items.name',
              quantity: '$items.quantity',
              image: '$items.image',
              price: '$items.price',
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          status: 1,
          shippingAddress: 1,
          sellerRevenue: 1,
          items: 1,
          customer: {
            _id: '$customer._id',
            displayName: '$customer.displayName',
            email: '$customer.email',
          },
        },
      },
    ]);
  }

  async getSellerProducts(sellerId) {
    return Product.find({ seller: sellerId })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getSellerProductById(productId) {
    return Product.findById(productId)
      .populate('category', 'name slug')
      .lean();
  }

  async updateSellerProduct(productId, update) {
    return Product.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .lean();
  }

  async getSellerOrders(sellerId, limit = 50) {
    return Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          status: { $first: '$status' },
          user: { $first: '$user' },
          shippingAddress: { $first: '$shippingAddress' },
          paymentInfo: { $first: '$paymentInfo' },
          sellerRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          soldUnits: { $sum: '$items.quantity' },
          items: {
            $push: {
              product: '$items.product',
              name: '$items.name',
              quantity: '$items.quantity',
              image: '$items.image',
              price: '$items.price',
              grade: '$items.grade',
              series: '$items.series',
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          status: 1,
          shippingAddress: 1,
          paymentInfo: 1,
          sellerRevenue: 1,
          soldUnits: 1,
          items: 1,
          customer: {
            _id: '$customer._id',
            displayName: '$customer.displayName',
            email: '$customer.email',
            avatar: '$customer.avatar',
          },
        },
      },
    ]);
  }

  async updateOrderStatus(orderId, status) {
    return Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'displayName email avatar')
      .lean();
  }

  async sellerCanAccessOrder(orderId, sellerId) {
    const [match] = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': new mongoose.Types.ObjectId(sellerId) } },
      { $limit: 1 },
      { $project: { _id: 1 } },
    ]);

    return !!match;
  }

  async getSellerTradeSignals(sellerId, limit = 4) {
    return TradeListing.find({ owner: sellerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new SellerRepository();
