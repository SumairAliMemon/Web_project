// routes/discussionBoardRoutes.js
const express = require('express');
const router = express.Router();
const {  addComment, getCommentsForPost, createDiscussionBoard, getDiscussionBoardsByCategory } = require('../Controller/postcontroller');

const {authMiddleware} = require('../middleware/middleware');
const {paginationMiddleware} = require('../middleware/pagenation');
// Create a new discussion board
router.post('/', authMiddleware,createDiscussionBoard);

// Get discussion boards by category (movie, actor, genre)
router.get('/:category',authMiddleware, paginationMiddleware ,getDiscussionBoardsByCategory);



// Add a comment to a discussion board post
router.post('/comment',authMiddleware, addComment);

// Get comments for a discussion board post
router.get('/comment/:postId', authMiddleware,getCommentsForPost);

module.exports = router;
