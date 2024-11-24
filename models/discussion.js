// models/DiscussionBoard.js
const mongoose = require('mongoose');

const DiscussionBoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['movie', 'actor', 'genre'], required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' },
  genre: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const DiscussionBoard = mongoose.model('DiscussionBoard', DiscussionBoardSchema);
module.exports = DiscussionBoard;

// models/Comment.js
