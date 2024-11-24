const mongoose = require('mongoose');

const CrewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  biography: { type: String },
  awards: [{ type: String }],
  filmography: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  photos: [{ type: String }],
  roleDescription: { type: String }  // Optional field for specific crew role (e.g., cinematographer, sound engineer)
});

const Crew = mongoose.model('Crew', CrewSchema);
module.exports = Crew;
