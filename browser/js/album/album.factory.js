  juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory("FetchAlbumFactory", function($http, $log, SongsFactory) {
  var funcObj = {};
  funcObj.fetchAll = function() {
    return $http.get("/api/albums")
      .then(function(response) {
        var albums = response.data;
        albums = albums.map(funcObj.addAlbumImage);
        return albums;
      })
      .catch($log.error);
    }

  funcObj.addAlbumImage = function (album) {
    album.imageUrl = '/api/albums/' + album._id + '.image';
    album.totalSongs = album.songs.length;
    return album;
  }

  funcObj.fetchById = function(id) {
    return $http.get("/api/albums/" + id)
      .then(function(response) {
        var album = response.data;
        album = funcObj.addAlbumImage(album);
        album.songs = album.songs.map(SongsFactory.addAudioUrl);
        return album;
      })
    }



  return funcObj;
})
