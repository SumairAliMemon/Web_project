const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String },
    awards: [{ type: String }],
    filmography: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    photos: [{ type: String }]
  });
  
  const Actor = mongoose.model('Actor', ActorSchema);
  module.exports = Actor;
  