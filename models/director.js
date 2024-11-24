const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  biography: { type: String },
  awards: [{ type: String }],
  filmography: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  photos: [{ type: String }]
});

const Director = mongoose.model('Director', DirectorSchema);
module.exports = Director;
