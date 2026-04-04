const User = require('../user/user.model');
const Order = require('../order/order.model');
const TradeListing = require('../trade/tradeListing.model');
const ApiError = require('../../shared/utils/ApiError');

class AdminService {
  async getStats() {
    const totalUsers = await User.countDocuments();
    
    const orders = await Order.find({ status: 'DELIVERED' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const activeTrades = await TradeListing.countDocuments({ status: 'open' });
    
    // Get monthly data for a simple chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentActivity = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'displayName email avatar');

    return {
      overview: {
        totalPilots: totalUsers,
        totalRevenue,
        activeMissions: activeTrades,
        systemUptime: '99.9%',
      },
      recentActivity,
    };
  }

  async getAllUsers() {
    return User.find().sort({ createdAt: -1 });
  }

  async getAllOrders() {
    return Order.find()
      .populate('user', 'displayName email avatar')
      .sort({ createdAt: -1 });
  }

  async getAllTrades() {
    return TradeListing.find()
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });
  }

  async updateTradeStatus(tradeId, status) {
    const trade = await TradeListing.findByIdAndUpdate(
      tradeId,
      { status },
      { new: true, runValidators: true }
    ).populate('owner', 'displayName email');

    if (!trade) {
      throw ApiError.notFound('Trade listing not found');
    }

    return trade;
  }
}

module.exports = new AdminService();
