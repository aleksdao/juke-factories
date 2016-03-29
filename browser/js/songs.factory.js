'use strict';

juke.factory("SongsFactory", function () {
  var songsFactoryFunc = {};
  songsFactoryFunc.addAudioUrl = function (song, i) {
    song.audioUrl = '/api/songs/' + song._id + '.audio';
    song.albumIndex = i;
    return song;
  }
  return songsFactoryFunc;
})
