'use strict';

juke.factory('PlayerFactory', function(){
  var audio = document.createElement('audio');
  var playing = false;
  var currentSong = null;
  // non-UI logic in here
  var toReturn = {};
  var songs = [];

  toReturn.pause = function () {
    console.log("getting into pause function")
    audio.pause();
    playing = false;
  }

  toReturn.start = function (song, songList) {
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
    songs = songList;
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

  toReturn.next = function () {
    var currIndex = songs.indexOf(currentSong);
    var nextIndex = currIndex === songs.length - 1 ? 0 : currIndex + 1;
    console.log(currIndex, nextIndex)
    this.start(songs[nextIndex], songs);
  }

  toReturn.previous = function () {
    var currIndex = songs.indexOf(currentSong);
    var prevIndex = currIndex === 0 ? songs.length - 1 : currIndex - 1;
    this.start(songs[prevIndex], songs);
  }

  toReturn.getProgress = function () {
    if(!currentSong) return 0;
    console.log(audio, audio.currentTime);
    // audio.addEventListener("timeupdate", function() {
    //   console.log(audio.currentTime);
    // })
    // return audio.currentTime / audio.duration;
  }

  return toReturn;
});
