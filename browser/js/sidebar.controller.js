juke.controller("SidebarCtrl", function ($scope, $rootScope) {
  $scope.viewAlbums = function () {
    console.log("in here")
    $rootScope.$broadcast("viewSwap", { name: "allAlbums" });
    console.log('here??');
  }

  $scope.viewAllArtists = function () {
    $rootScope.$broadcast("viewSwap", { name: "allArtists" });
  }
});
