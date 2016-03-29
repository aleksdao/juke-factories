juke.controller("ArtistCtrl", function ($scope, $rootScope, ArtistFactory, PlayerFactory) {
  $rootScope.$on("viewSwap", function (event, data) {
    $scope.showMe = data.name === "oneArtist";
    if($scope.showMe) {
      ArtistFactory.fetchById(data.artist._id)
        .then(function (artist) {
          console.log(artist);
          $scope.artist = artist;
          $scope.albums = artist.albums;
          $scope.songs = artist.songs;
        })
    }
  })

  $scope.getCurrentSong = function () {
    return PlayerFactory.getCurrentSong();
  }

  $scope.toggle = function (song) {
    console.log(PlayerFactory.getCurrentSong());
    if (PlayerFactory.isPlaying()) PlayerFactory.pause();
    else PlayerFactory.start(song, $scope.songs);
  }

  $scope.playing = function () {
    return PlayerFactory.isPlaying();
  }

  $scope.viewOneAlbum = function (album) {
    $rootScope.$broadcast("viewSwap", { name: "oneAlbum", album: album });
  }

})
