'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, trim: true },
  artists: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  genres: [String],
  extension: { type: String }
});

schema.methods.getAlbums = function () {
  return mongoose
  .model('Album')
  .find({ songs: this._id });
};

schema.methods.getPlaylists = function () {
  return mongoose
  .model('Playlist')
  .find({ playlists: this._id });
};

module.exports = mongoose.model('Song', schema);
