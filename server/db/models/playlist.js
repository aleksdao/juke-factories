const mongoose = require('mongoose');
const songListPlugin = require('../plugins/songList');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, trim: true },
});

// this plugin gives it song and artist arrays
// with some fancy validations and auto population
// check it out!
schema.plugin(songListPlugin);

module.exports = mongoose.model('Playlist', schema);
