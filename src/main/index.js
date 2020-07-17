/* eslint-disable no-undef */

// IMPORT JS MODULES
import { app, BrowserWindow, ipcMain } from 'electron'
import { format as formatUrl } from 'url'
import path from 'path'

// IMPORT THE SERIAL CONNECTORS FROM THE FILE
const sConn = require('./serial_connection.js')

// CHECK IF IS IN DEVELOPMENT MODE
const isDevelopment = process.env.NODE_ENV !== 'production'

// LOG IF THE PROCESS IS RUNNING
console.log('run')

// INSTANTIATE THE WINDOW WHEN THE APP IS READY
app.on('ready', () => {
  // BEGIN

  // SET THE WINDOW SETTINGS
  global.win = new BrowserWindow({
    width: 1024, // THIS CAN BE CHANGED WITHOUT BREAKING ANYTHING
    minHeight: 300,
    minWidth: 720,
    webPreferences: {
      nodeIntegration: true // LOOK INTO USING PRELOAD.JS
    }
  })

  // IF WE ARE IN DEV MODE,
  if (isDevelopment) {
    // LOAD FROM THE HOSTED WEB SEver
    global.win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)

    // IF IN PRODUCTION,
  } else {
    // LOAD THE INDEX.HTML FROM THE FILE INSTEAD
    global.win.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }
  console.log(global.win)

  global.win.webContents.on('did-finish-load', () => {
    /*
    ipcMain.on('ping', (event, arg) => {
      console.log(arg) // prints "ping"
      win.webContents.send('pong', 'whoooooooh!')
    }) */

    // CHANGE THE SIZE ON RESIZE
    global.win.on('resize', function () {
      setTimeout(function () {
        var size = win.getSize()
        win.setSize(size[0], parseInt(size[0] * 9 / 16))
      }, 0)
    })
  })
  global.win.on('closed', () => { // UPON WINDOW CLOSE ASK
    global.win = null // CLOSE THE WINDOw
  })
})

app.on('window-all-closed', () => { // UPON WINDOWS CLOSE
  if (process.platform !== 'darwin') { // IF RUNNING ON A MAC
    app.quit() // CLOSE THE APP
  }
})

ipcMain.on('list_connected_devices', (event, data) => {
  // query the device for ports
  sConn.readPortsObject(function (data) {
    // emit the connected devices information back to the frontend
    event.reply('list_connected_devices', data)
  })
})

ipcMain.on('manual_connection', (event, comPath) => {
  sConn.connectByPath(comPath, function (err) {
    event.reply('manual_connection', err)
  })
})

ipcMain.on('connect_by_aspect', (event, data) => {
  sConn.connectByCOMAspect('manufacturer', function (err) {
    sConn.constructParser(function (data) {
      console.log(data)
      if (data.includes('gx')) {
        global.win.webContents.send('x_update', data.replace('gx', ''))
      } else if (data.includes('gy')) {
        global.win.webContents.send('y_update', data.replace('gy', ''))
      } else {
        global.win.webContents.send('data_recieved', data)
      }
    })
    event.reply('connect_by_aspect', err)
  })
})

ipcMain.on('send_data', (event, data) => {
  sConn.sendData(data, function (dat) {
    event.reply('send_data', dat)
  })
})
