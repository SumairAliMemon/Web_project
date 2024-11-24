const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  releaseDate: { type: Date },
  runtime: { type: Number, required: true }, // runtime in minutes
  synopsis: { type: String },
  averageRating: { type: Number, default: 0 },
  coverPhoto: { type: String }, 
  trivia: [{ type: String }],
  goofs: [{ type: String }],
  soundtrackInfo: [{ type: String }],
  ageRating: { type: String }, // e.g., "PG-13"
  parentalGuidance: { type: String },
  isReleased: { type: Boolean, default: true }, // New field for release status

  // New attributes for directors and crew (optional references)
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crew' }]
}, { timestamps: true });

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
