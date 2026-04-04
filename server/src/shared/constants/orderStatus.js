const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
});

const PAYMENT_METHODS = Object.freeze({
  COD: 'cod',
  BANK_TRANSFER: 'bank-transfer',
  MOMO: 'momo',
});

module.exports = { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS };
