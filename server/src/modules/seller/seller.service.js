const sellerRepository = require('./seller.repository');
const ApiError = require('../../shared/utils/ApiError');

class SellerService {
  async getDashboard(sellerId) {
    const [productStats, salesStats, topProducts, recentOrders, products, recentTrades] = await Promise.all([
      sellerRepository.getProductStats(sellerId),
      sellerRepository.getSalesStats(sellerId),
      sellerRepository.getTopProducts(sellerId),
      sellerRepository.getRecentOrders(sellerId),
      sellerRepository.getSellerProducts(sellerId),
      sellerRepository.getSellerTradeSignals(sellerId),
    ]);

    return {
      overview: {
        totalProducts: productStats.totalProducts,
        activeProducts: productStats.activeProducts,
        totalStock: productStats.totalStock,
        totalRevenue: salesStats.totalRevenue,
        soldUnits: salesStats.soldUnits,
        totalOrders: salesStats.totalOrders,
      },
      topProducts,
      recentOrders,
      products,
      recentTrades,
    };
  }

  async getProducts(sellerId) {
    return sellerRepository.getSellerProducts(sellerId);
  }

  async updateProduct(productId, sellerId, payload) {
    const product = await sellerRepository.getSellerProductById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (product.seller.toString() !== sellerId.toString()) {
      throw ApiError.forbidden('You do not have permission to update this product');
    }

    const update = {};
    if (payload.stock !== undefined) {
      update.stock = payload.stock;
      if (payload.stock === 0 && !payload.status) {
        update.status = 'out_of_stock';
      }
    }

    if (payload.status) {
      update.status = payload.status;
    }

    if (payload.price !== undefined) {
      update.price = payload.price;
    }

    return sellerRepository.updateSellerProduct(productId, update);
  }

  async getOrders(sellerId) {
    return sellerRepository.getSellerOrders(sellerId);
  }

  async updateOrderStatus(orderId, sellerId, status) {
    const canAccessOrder = await sellerRepository.sellerCanAccessOrder(orderId, sellerId);
    if (!canAccessOrder) {
      throw ApiError.forbidden('You do not have permission to update this order');
    }

    const order = await sellerRepository.updateOrderStatus(orderId, status);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }
}

module.exports = new SellerService();
