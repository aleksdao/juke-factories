'use strict';

juke.factory("ArtistFactory", function ($rootScope, $http, $log, $q, FetchAlbumFactory, SongsFactory) {
  var artistFactoryFunc = {};
  artistFactoryFunc.fetchAll = function () {
    return $http.get("/api/artists")
      .then(function (response) {
        var artists = response.data;
        console.log(artists);
        return artists;
      })
      .catch($log.error);
  }

  artistFactoryFunc.fetchById = function (id) {
    var promises = [];
    var artistPromise = $http.get("/api/artists/" + id);
    var albumsPromise = $http.get("/api/artists/" + id + "/albums");
    var songsPromise = $http.get("/api/artists/" + id + "/songs")
    promises.push(artistPromise);
    promises.push(albumsPromise);
    promises.push(songsPromise)
    return $q.all(promises)
      .then(function (response) {
        var artist = response[0].data;
        artist.albums = response[1].data;
        artist.albums = artist.albums.map(FetchAlbumFactory.addAlbumImage);
        artist.songs = response[2].data;
        artist.songs = artist.songs.map(SongsFactory.addAudioUrl);
        // artist.songs.forEach(function (song, i) {
        //   song.audioUrl = '/api/songs/' + song._id + '.audio';
        //   song.albumIndex = i;
        // });
        return artist;
      })
  }

  return artistFactoryFunc;
})
