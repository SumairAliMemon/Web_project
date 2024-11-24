const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionBoard', required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Comment = mongoose.model('Comment', CommentSchema);
  module.exports = Comment;
   