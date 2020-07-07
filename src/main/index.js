/* eslint-disable no-undef */

// IMPORT JS MODULES
import { app, BrowserWindow, ipcMain } from 'electron'
import { format as formatUrl } from 'url'
import path from 'path'

// IMPORT NODE STUFF
const SerialPort = require('serialport')
const Delimiter = SerialPort.parsers.Delimiter

// IMPORT THE CONFIGS FROM THE CONFIGS FILE
const configs = require('./app_config.json')

// CHECK IF IS IN DEVELOPMENT MODE
const isDevelopment = process.env.NODE_ENV !== 'production'

// LOG IF THE PROCESS IS RUNNING
console.log('run')

// INSTANTIATE THE WINDOW WHEN THE APP IS READY
app.on('ready', () => {
  // BEGIN

  // SET THE WINDOW SETTINGS
  var window = new BrowserWindow({
    width: 1024, // THIS CAN BE CHANGED WITHOUT BREAKING ANYTHING
    webPreferences: {
      nodeIntegration: true // LOOK INTO USING PRELOAD.JS
    }
  })

  // IF WE ARE IN DEV MODE,
  if (isDevelopment) {
    // LOAD FROM THE HOSTED WEB SERVER
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)

    // IF IN PRODUCTION,
  } else {
    // LOAD THE INDEX.HTML FROM THE FILE INSTEAD
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }
  console.log(window)
  window.on('closed', () => { // UPON WINDOW CLOSE ASK
    window = null // CLOSE THE WINDOw
  })
})

app.on('window-all-closed', () => { // UPON WINDOWS CLOSE
  if (process.platform !== 'darwin') { // IF RUNNING ON A MAC
    app.quit() // CLOSE THE APP
  }
})

ipcMain.on('ping', (event, msg) => {
  console.log(msg) // msg from web page

  event.reply('pong', 'hi web page') // send to web page
})

ipcMain.on('list_connected_devices', (event, msg) => {
  console.log(msg)
  console.log(event)
  // query the device for ports
  SerialPort.list().then(function (data) {
    // emit the connected devices information back to all connected sockets
    event.reply('list_connected_devices', data)
  })
})

ipcMain.on('manual_connection', (event, data) => {
  response = connectByPath(data)
  event.reply('manual_connection', response)
})

/*
ipcMain.on('connect_by_manufacturer',(event,data) =>{
  console.log(event)
  // make a connection to the given port
  global.serial_port_connection = new SerialPort(data.path, {
    baudRate:configs.baud
  },function(data){
      // upon the opening of the port print a message to the console
      console.log('opening a connection to the device on port: ',data.path)
  });

  // setup the input parser for the given port

})
*/

ipcMain.on('send_data_to_device', (event, data) => {
  console.log(data.packet) // msg from web page
  event.reply('pong', 'hi web page') // send to web page
})

// CONSTRUCT THE MANUAL CONNECTION FUNCTION
const connectByPath = function (data) {
  // CONNECT FROM PATH

  // MAKE A SERIAL PORT CONNECTION FOR WRITING
  global.serial_port_connection = new SerialPort(data.path, {
    baudRate: configs.BAUD // SET THE BAUD RATE
  }, function (data) {
    // UPON THE OPENING OF THE PORT LOG IT
    console.log('opening a connection to the device on port: ', data.path)
  })

  // setup a parser for the given port
  global.serial_port_parser = global.serial_port_connection.pipe(new Delimiter({ // CREATE THE PARSER
    delimiter: String.fromCharCode(configs.DELIM_VAL), // SET THE DELIMITING CHAR
    encoding: configs.SERIAL_ENCODING // SET THE SERIAL ENCODING
  }))

  returnFlag = 'This definitely worked, rawr XD' // SET THE OUTPUT

  return returnFlag
}

/*
const constructParser = function (data) {
  global.serial_port_parser.on('data', function (data) {
    // WAHH
  })
}
*/
