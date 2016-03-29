'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, FetchAlbumFactory, StatsFactory, PlayerFactory) {


  $scope.toggle = function (song) {
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      PlayerFactory.pause();
    } else {
      PlayerFactory.start(song, $scope.album.songs);
      // $scope.currentSong = song;
      // $scope.playing = true;
    }
  };

  $scope.getCurrentSong = function () {
    return PlayerFactory.getCurrentSong();
  }

  $scope.playing = function (song) {
    return PlayerFactory.isPlaying();
  }

  $rootScope.$on("viewSwap", function (event, data) {
    $scope.showMe = data.name === "oneAlbum";
    if($scope.showMe) {
      FetchAlbumFactory.fetchById(data.album._id)
        .then(function (album) {
          StatsFactory.totalTime(album)
            .then(function (albumDuration) {
              $scope.fullDuration = albumDuration;
            })
          $scope.album = album;
        })
    }
  })

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; };

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  };
  function next () { skip(1); };
  function prev () { skip(-1); };

});
