'use strict';

// arguments
const dir = process.argv[2];
// built-in modules
const pathLib = require('path');
// installed modules
const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs-extra');
const mongoose = require('mongoose');
const chalk = require('chalk');
// custom modules
const helper = require('./helper');
const metadata = require('./metadataWrapper');
const connectToDb = require('../server/db');

const filesDir = pathLib.join(process.cwd(), 'server/audio');
const Song = mongoose.model('Song');
Promise.promisifyAll(fs);

const extractMetaData = function (path) {
  return helper.dirWalk(path)
    .then(filesNames => filesNames.filter(helper.isMp3))
    .map(name => metadata(name));
};

const clearDb = function () {
  return Promise.map(['Artist', 'Album', 'Song'], function (modelName) {
    return mongoose.model(modelName).remove();
  });
};

connectToDb.bind({ docsToSave: {} })
.then(function () { // get song metadata and clear db at same time
  return Promise.join(extractMetaData(dir), clearDb());
})
.spread(function (metaData, removeResponses) { // create the artists
  this.files = metaData;
  let artists = _(this.files)
    .pluck('artist')
    .flatten()
    .uniq()
    .value();
  return Promise.map(artists, function (artist) {
    return mongoose.model('Artist').findOrCreate({ name: artist });
  });
})
.then(function (artists) { // create the albums
  this.artists = _.indexBy(artists, 'name');
  let albums = _(this.files)
    .pluck('album')
    .uniq()
    .value();
  return Promise.map(albums, function (album) {
    return mongoose.model('Album').findOrCreate({ name: album });
  });
})
.then(function (albums) { // create the songs
  this.albums = _.indexBy(albums, 'name');
  this.files = this.files.map(function (file) {
    file.song = new Song({
      name: file.title,
      artists: file.artist.map(a => this.artists[a], this),
      genres: file.genre
    });
    file.song.extension = pathLib.extname(file.path);
    return file;
  }, this);
  let songs = _(this.files)
    .pluck('song')
    .invoke('save')
    .value();
  return Promise.all(songs);
})
.tap(function () { // empty audio folder (or create if it does not yet exist)
  return fs.emptyDirAsync(filesDir);
})
.then(function (songs) { // move the files
  this.songs = songs;
  return Promise.map(this.files, function (file) {
    return new Promise(function (resolve, reject) {
      let readStream = fs.createReadStream(file.path);
      let writeStream = fs.createWriteStream(pathLib.join(filesDir, file.song.id));
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      readStream.pipe(writeStream);
    });
  });
})
.then(function () { //associate the songs with their albums
  // push into albums' song arrays
  this.files.forEach(file => {
    var album = this.albums[file.album];
    album.songs.push(file.song);
    if (file.picture && file.picture.data) {
      album.cover = file.picture.data;
      album.coverType = file.picture.format;
    }
  });
  // save albums
  let albums = _(this.albums)
    .values()
    .invoke('save')
    .value()
  return Promise.all(albums);
})
.then(function () {
  console.log(chalk.green('complete!'));
  process.exit(0);
})
.catch(function (err) {
  console.error(chalk.red(err));
  console.error(err.stack);
  process.exit(1);
});
