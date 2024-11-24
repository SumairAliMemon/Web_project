const paginationMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    const { page = 1, limit = 10 } = req.query;

    // Convert query parameters to integers
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Ensure page >= 1
    const pageLimit = Math.max(parseInt(limit, 10) || 10, 1); // Ensure limit >= 1

    // Calculate skip for pagination
    const skip = (pageNumber - 1) * pageLimit;

    // Attach pagination values to the `req` object
    req.pagination = {
      skip,
      limit: pageLimit,
    };
  }

  next(); // Pass control to the next middleware
};

module.exports = { paginationMiddleware };
