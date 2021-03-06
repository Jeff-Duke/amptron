'use strict';

const { app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');
const path = require('path');

const { createSongObject, createSongUri } = require('electron-audio-conversion');

let mainWindow;
let config = {};

if (process.env.NODE_ENV === 'development') {
  config = require('../config');
  config.url = `http://localhost:${config.port}`;
} else {
  config.devtron = false;
  config.url = `file://${__dirname}/dist/index.html`;
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    maxHeight: 500,
    maxWidth: 500,
    minHeight: 500,
    minWidth: 500,
    webSecurity: false,
    experimentalFeatures: true
  });

  mainWindow.loadURL(config.url);
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'));

    let installExtension = require('electron-devtools-installer');

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  console.log('mainWindow opened');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const openFile = exports.openFile = () => {
  const files = dialog.showOpenDialog({
    title: 'Open File',
    properties: [ 'openFile' ],
    filters: [
      {name: 'Audio Files', extensions: ['mp3']},
    ]
  });

  if (!files) { return; }

  const filePath = files[0];
  return createSongObject(filePath);
};

const generateUri = exports.generateUri = (filePath, mimeType) => {
  return createSongUri(filePath, mimeType);
};

process.env['APP_PATH'] = app.getAppPath();
