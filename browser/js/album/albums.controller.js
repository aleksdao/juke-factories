juke.controller('AlbumsCtrl', function($scope,FetchAlbumFactory, $log){
  FetchAlbumFactory.fetchAll()
  .then(function(albums){
    albums.forEach(function(album){
      album.imageUrl = '/api/albums/' + album._id + '.image';
      album.totalSongs = album.songs.length;
    })
    $scope.albums = albums;
  })
})
