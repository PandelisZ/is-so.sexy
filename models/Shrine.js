const mongoose = require('mongoose');

const shrineSchema = new mongoose.Schema({

  name: String,
  description: String,
  images: [String],
  subdomain: String,
  owner: String
}, { timestamps: true });

const Shrine = mongoose.model('Shrine', shrineSchema);

module.exports = Shrine;
