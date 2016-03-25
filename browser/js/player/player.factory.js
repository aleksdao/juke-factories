'use strict';

juke.factory('PlayerFactory', function(){
  var audio = document.createElement('audio');
  var playing = false;
  var currentSong = null;
  // non-UI logic in here
  var toReturn = {};
  // toReturn.start = function (song) {
  //
  // }

  toReturn.pause = function () {
    console.log("getting into pause function")
    audio.pause();
    playing = false;
  }

  toReturn.start = function (song) {
    // stop existing audio (e.g. other song) in any case
    // pause();
    // $scope.playing = true;
    // // resume current song
    // if (song === $scope.currentSong) return audio.play();
    // // enable loading new song
    // $scope.currentSong = song;
    // audio.src = song.audioUrl;
    // audio.load();
    // audio.play();
    // pause();
    // if(playing) pause();
    this.pause();
    playing = true;
    currentSong = song;
    // if (song === $rootScope.currentSong) return audio.play();
    // $rootScope.currentSong = song;
    audio.src = song.audioUrl;
    audio.load();
    audio.play();
  }

  toReturn.resume = function () {
    audio.play();
    playing = true;
  }

  toReturn.isPlaying = function () {
    return playing;
  }

  toReturn.getCurrentSong = function () {
    return currentSong;
  }
  return toReturn;
});
