const express = require('express');
const router = express.Router();
const {
  createBoxOfficeData,
  getBoxOfficeData,
  updateBoxOfficeData
} = require('../Controller/boxofficecontroller'); // Import your controller functions
const {paginationMiddleware} = require('../middleware/pagenation');

// Create box office data for a movie
router.post('/', createBoxOfficeData);

// Get box office data for a specific movie
router.get('/:movieId',paginationMiddleware, getBoxOfficeData);

// Update box office data for a specific movie
router.put('/:movieId', updateBoxOfficeData);

module.exports = router;
