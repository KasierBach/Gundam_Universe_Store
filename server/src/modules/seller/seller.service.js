const sellerRepository = require('./seller.repository');

class SellerService {
  async getDashboard(sellerId) {
    const [productStats, salesStats, topProducts, recentOrders, products] = await Promise.all([
      sellerRepository.getProductStats(sellerId),
      sellerRepository.getSalesStats(sellerId),
      sellerRepository.getTopProducts(sellerId),
      sellerRepository.getRecentOrders(sellerId),
      sellerRepository.getSellerProducts(sellerId),
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
    };
  }
}

module.exports = new SellerService();
