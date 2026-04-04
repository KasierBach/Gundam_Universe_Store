const Order = require('./order.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  /**
   * Find orders by user ID sorted by creation date
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    return this.model.find({ user: userId }).sort({ createdAt: -1 });
  }

  /**
   * Find order by ID and populate user details (for Admin)
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async findDetailById(id) {
    return this.model.findById(id).populate('user', 'displayName email avatar');
  }

  /**
   * Update order status
   * @param {string} id 
   * @param {string} status 
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update payment status
   * @param {string} id 
   * @param {string} status 
   * @param {string} transactionId 
   * @returns {Promise<Object>}
   */
  async updatePayment(id, status, transactionId = null) {
    const update = { "paymentInfo.status": status };
    if (transactionId) update["paymentInfo.transactionId"] = transactionId;
    
    return this.model.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
  }
}

module.exports = new OrderRepository();
