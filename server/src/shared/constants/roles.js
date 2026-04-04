const ROLES = Object.freeze({
  GUEST: 'guest',
  CUSTOMER: 'customer',
  SELLER: 'seller',
  TRADER: 'trader',
  ADMIN: 'admin',
});

const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALL_ROLES };
