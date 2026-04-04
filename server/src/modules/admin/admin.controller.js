const adminService = require('./admin.service');
const ApiResponse = require('../../shared/utils/ApiResponse');
const BaseController = require('../../shared/base/BaseController');

class AdminController extends BaseController {
  constructor() {
    super(adminService);
  }

  /** GET /api/admin/stats */
  getStats = this.handler(async (req, res) => {
    const stats = await this.service.getStats();
    ApiResponse.success(stats, 'Strategic data retrieved').send(res);
  });

  /** GET /api/admin/users */
  getUsers = this.handler(async (req, res) => {
    const users = await this.service.getAllUsers();
    ApiResponse.success(users, 'User fleet retrieved').send(res);
  });

  /** GET /api/admin/orders */
  getOrders = this.handler(async (_req, res) => {
    const orders = await this.service.getAllOrders();
    ApiResponse.success(orders, 'Order grid retrieved').send(res);
  });

  /** GET /api/admin/trades */
  getTrades = this.handler(async (req, res) => {
    const trades = await this.service.getAllTrades();
    ApiResponse.success(trades, 'Mission overview retrieved').send(res);
  });

  /** PATCH /api/admin/trades/:id/status */
  updateTradeStatus = this.handler(async (req, res) => {
    const trade = await this.service.updateTradeStatus(req.params.id, req.body.status);
    ApiResponse.success(trade, 'Trade status updated').send(res);
  });
}

module.exports = new AdminController();
