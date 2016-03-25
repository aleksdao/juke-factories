'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, FetchAlbumFactory, StatsFactory) {

  // load our initial data


console.log(FetchAlbumFactory);
  // $http.get('/api/albums/')
  // .then(function (res) { return res.data; })
  // .then(function (albums) {
  //   return $http.get('/api/albums/' + albums[0]._id); // temp: get one
  // })
  // .then(function (res) { return res.data })
FetchAlbumFactory.fetchAll()
  .then(function (albums) {
    return FetchAlbumFactory.fetchById(albums[0]._id)
  })
  .then(function (album) {
    album.imageUrl = '/api/albums/' + album._id + '.image';
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song._id + '.audio';
      song.albumIndex = i;
    });
    $scope.album = album;
    StatsFactory.totalTime(album)
      .then(function (albumDuration) {
        $scope.fullDuration = albumDuration;
        console.log($scope.fullDuration);
      })
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // console.log(StatsFactory.totalTime($scope.album));


  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  };

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
