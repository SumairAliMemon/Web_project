const DiscussionBoard = require('../models/discussion');
const Comment = require('../models/comment');

// Create a new discussion board
exports.createDiscussionBoard = async (req, res) => {
  try {
    const { title, content, category, movieId, actorId, genre } = req.body;
    const createdBy = req.user.id;  // Assuming `req.user` has the authenticated user details

    const discussionBoard = new DiscussionBoard({
      title,
      content,
      category,
      movieId: category === 'movie' ? movieId : undefined,
      actorId: category === 'actor' ? actorId : undefined,
      genre: category === 'genre' ? genre : undefined,
      createdBy
    });

    await discussionBoard.save();
    res.status(201).json({ message: 'Discussion board created successfully', discussionBoard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating discussion board' });
  }
};

// Get discussion boards by category (movie, actor, genre) with pagination
exports.getDiscussionBoardsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { skip, limit } = req.pagination;  // Pagination values from middleware
    const filter = category === 'genre' ? { category, genre: req.query.genre } : { category };

    const boards = await DiscussionBoard.find(filter)
      .skip(skip)  // Skip based on page and limit
      .limit(limit)  // Limit based on page and limit
      .populate('movieId actorId createdBy', 'name'); // Populate references

    const totalBoards = await DiscussionBoard.countDocuments(filter);  // Get total count for pagination
    const totalPages = Math.ceil(totalBoards / limit);  // Calculate total pages

    res.status(200).json({
      boards,
      totalBoards,
      totalPages,
      currentPage: Math.ceil((skip + 1) / limit),  // Current page number
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching discussion boards' });
  }
};

// Create a comment on a post
exports.addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const createdBy = req.user.id;  // Assuming `req.user` has the authenticated user details

    const discussionBoard = await DiscussionBoard.findById(postId);
    if (!discussionBoard) {
      return res.status(404).json({ message: 'Discussion board not found' });
    }

    const comment = new Comment({
      postId,
      content,
      createdBy
    });

    await comment.save();
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Get comments for a discussion board post with pagination
exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { skip, limit } = req.pagination;  // Pagination values from middleware

    const comments = await Comment.find({ postId })
      .skip(skip)  // Skip based on page and limit
      .limit(limit)  // Limit based on page and limit
      .populate('createdBy', 'name'); // Populate user details

    const totalComments = await Comment.countDocuments({ postId });  // Get total count for pagination
    const totalPages = Math.ceil(totalComments / limit);  // Calculate total pages

    res.status(200).json({
      comments,
      totalComments,
      totalPages,
      currentPage: Math.ceil((skip + 1) / limit),  // Current page number
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};
