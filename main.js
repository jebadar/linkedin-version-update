const electron = require('electron');
// const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require("electron-updater");

let winOne;

let win; // this will store the window object

// creates the default window
function createDefaultWindow() {
  win = new BrowserWindow({width: 900, height: 680});
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  var v = app.getVersion();
  win.webContents.send('version',v);

  win.on('closed', () => app.quit());
  return win;
}
// function createwindow() {
//   winOne = new BrowserWindow();
//   winOne.loadURL(url.format({
//     pathname:path.join(__dirname,'one.html'),
//     protocol:'file',
//     slashes:true
//   }));
//   winOne.on('closed',() => {
//     win = null;
//   })
//   winOne.webContents.openDevTools();
//
// }
// app.on('ready',createwindow);
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
}
});

app.on('activate', () => {
  if(win === null) {
    createwindow();
}
})
// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function() {
  createDefaultWindow()
  autoUpdater.checkForUpdates();
  console.log(app.getVersion())
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})