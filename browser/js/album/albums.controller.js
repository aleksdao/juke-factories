juke.controller('AlbumsCtrl', function ($scope, $rootScope, FetchAlbumFactory, $log){
  FetchAlbumFactory.fetchAll()
  .then(function(albums){
    $scope.albums = albums;
  })

  $scope.showMe = true;

  $rootScope.$on("viewSwap", function (event, data) {
    $scope.showMe = data.name === "allAlbums";
  })

  $scope.viewOneAlbum = function (album) {
    $rootScope.$broadcast("viewSwap", { name: "oneAlbum", album: album });
  }

})
