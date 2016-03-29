'use strict';

juke.factory('PlayerFactory', function($rootScope){
  var audio = document.createElement('audio');
  var playing = false;
  var currentSong = null;
  var toReturn = {};
  var songs = [];
  var that = this;

  audio.addEventListener("ended", function () {
    console.log(this);
    // that.next();
    $rootScope.$digest();
  }.bind(this))



  toReturn.pause = function () {
    audio.pause();
    playing = false;
  }

  toReturn.start = function (song, songList) {
    console.log(this);
    this.pause();


    songs = songList;
    playing = true;
    if (currentSong !== song) {
      currentSong = song;
      audio.src = song.audioUrl;
      audio.load();
    }

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
    this.start(songs[nextIndex], songs);
  }

  toReturn.previous = function () {
    var currIndex = songs.indexOf(currentSong);
    var prevIndex = currIndex === 0 ? songs.length - 1 : currIndex - 1;
    this.start(songs[prevIndex], songs);
  }

// need to do this


  toReturn.getProgress = function () {
    if(!currentSong) return 0;
    else {
      var progress = audio.currentTime / audio.duration;
      return progress;
    }
  }


  audio.addEventListener("timeupdate", function () {
    $rootScope.$digest();
  })


  return toReturn;
});
