const TRADE_LISTING_STATUS = Object.freeze({
  OPEN: 'open',
  IN_NEGOTIATION: 'in-negotiation',
  COMPLETED: 'completed',
  CLOSED: 'closed',
});

const TRADE_OFFER_STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
});

module.exports = { TRADE_LISTING_STATUS, TRADE_OFFER_STATUS };
