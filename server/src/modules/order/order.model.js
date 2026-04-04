const mongoose = require('mongoose');
const { PRODUCT_GRADES, PRODUCT_CONDITIONS } = require('../../shared/constants/productConstants');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  grade: { type: String, enum: Object.values(PRODUCT_GRADES) },
  series: { type: String },
  condition: { type: String, enum: Object.values(PRODUCT_CONDITIONS) },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, default: 'Vietnam' },
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
    index: true,
  },
  paymentInfo: {
    method: { type: String, enum: ['COD', 'BANK_TRANSFER', 'PAYPAL'], default: 'COD' },
    status: { type: String, enum: ['UNPAID', 'PAID', 'REFUNDED'], default: 'UNPAID' },
    transactionId: { type: String },
  },
  notes: { type: String },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
