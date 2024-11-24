const mongoose = require('mongoose');

const BoxOfficeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },  // Link to the Movie model
  openingWeekendEarnings: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  internationalRevenue: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }  // To track when the earnings are updated
}, { timestamps: true });

const BoxOffice = mongoose.model('BoxOffice', BoxOfficeSchema);

module.exports = BoxOffice;
