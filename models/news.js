const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Movies', 'Actors', 'Industry'], required: true },
  datePublished: { type: Date, default: Date.now },
  relatedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  relatedActors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  imageUrl: { type: String }, // Optional: For images related to news articles
}, { timestamps: true });

const NewsArticle = mongoose.model('NewsArticle', NewsArticleSchema);

module.exports = NewsArticle;
