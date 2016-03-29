'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  // initialize audio player (note this kind of DOM stuff is odd for Angular)
  var audio = document.createElement('audio');



  $scope.getProgress = function () {
    return 100 * PlayerFactory.getProgress();
  }

  // state
  $scope.getCurrentSong = function () {
    return PlayerFactory.getCurrentSong();
  };
  $scope.playing = function () {
    return PlayerFactory.isPlaying();
  };


  // main toggle
  $scope.toggle = function (song) {
    if (PlayerFactory.isPlaying()) PlayerFactory.pause();
    else PlayerFactory.start(song);
  };


  // outgoing events (to Album… or potentially other characters)
  $scope.next = function () {
    PlayerFactory.pause();
    PlayerFactory.next();
  };
  $scope.prev = function ()
  {
    PlayerFactory.pause();
    PlayerFactory.previous();
  };

});
