'use strict';
const dataurl = require('dataurl');
const fs = require('fs');
const id3 = require('id3js');
const mp3Duration = require('mp3-duration');
const PlayList = require('./src/components/SidebarView/PlayList');

const gimmeSong = (filePath, callback) => {
  const track = {};
  id3({ file: filePath, type: id3.OPEN_LOCAL }, (err, tags) => {
    if (err) { console.log(err); }
    if (tags) {
      const { title, album, artist } = tags;
      Object.assign(track, {
        title,
        artist,
        album,
        track: tags.v1.track,
      });
    }
  });
  mp3Duration(filePath, (err, duration) => {
    if (err) console.log(err.message);
    Object.assign(track, {
      duration,
    });
  });
  fs.readFile(filePath,
  (err, data) => {
    if (err) { callback(err); }
    const encoded = dataurl.convert({ data, mimetype: 'audio/mp3' });
    Object.assign(track, {
      encoded,
    });
    PlayList.push(track);
  });
};

module.exports = gimmeSong;