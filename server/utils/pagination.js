module.exports.getPagination = (page, limit, totalDocuments) => {
  page = parseInt(page);
  limit = parseInt(limit);
  return {
    currentPage: page,
    perPage: limit,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments: totalDocuments,
    hasNextPage: page * limit < totalDocuments,
    hasPrevPage: page > 1,
    previousPage: page - 1,
  };
};
