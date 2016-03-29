juke.controller("ArtistsCtrl", function ($scope, $rootScope, ArtistFactory) {


  $rootScope.$on("viewSwap", function (event, data) {
    $scope.showMe = data.name === "allArtists";
    if($scope.showMe) {
      ArtistFactory.fetchAll()
        .then(function (artists) {
          $scope.artists = artists;
        })
    }
  })

  $scope.viewOneArtist = function (artist) {
    $rootScope.$broadcast("viewSwap", { name: "oneArtist", artist: artist });
  }

})
