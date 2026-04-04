/**
 * Build pagination metadata from query params
 * @param {Object} query - Express req.query
 * @param {number} totalItems - Total count from DB
 * @returns {{ skip: number, limit: number, pagination: Object }}
 */
const buildPagination = (query, totalItems) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 12, 1), 100);
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    skip,
    limit,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { buildPagination };
