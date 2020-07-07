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

ipcMain.on('list_connected_devices', (event, data) => {
  // query the device for ports
  readPortsObject(function (err, data) {
    if (err) {
      console.log(err)
    } else {
      // emit the connected devices information back to all connected sockets
      event.reply('list_connected_devices', data)
    }
  })
})

ipcMain.on('manual_connection', (event, comPath) => {
  connectByPath(comPath, function (err) {
    event.reply('manual_connection', err)
  })
})

ipcMain.on('connect_by_aspect', (event, data) => {
  connectByCOMAspect('manufacturer', configs.MANUFACTURER, function (err) {
    event.reply('connect_by_aspect', err)
  })
})

ipcMain.on('send_data_to_device', (event, data) => {
  console.log(data.packet) // msg from web page
  event.reply('pong', 'hi web page') // send to web page
})

//
//
//
//
//
//
//
//

// CONSTRUCT THE READ PORTS FUNCTION
const readPortsObject = function (callback) {
  // query the device for ports
  SerialPort.list().then(function (data) {
    if (callback) {
      callback(err, data)
    } else {
      throw Error('This function requires a callback')
    }
  })
}

// CONSTRUCT THE MANUAL CONNECTION FUNCTION
const connectByPath = function (data, callback) {
  // CONNECT FROM PATH

  // MAKE A SERIAL PORT CONNECTION FOR WRITING
  global.serial_port_connection = new SerialPort(data.path, {
    baudRate: configs.BAUD // SET THE BAUD RATE
  }, function (data) {
    // UPON THE OPENING OF THE PORT LOG IT
    console.log('opening a connection to the device on port: ', data.path)
  })

  global.serial_port_connection.on('open', function () {
    console.log('connection done! now connected at port: ' + arduinoport)
  })

  // setup a parser for the given port
  global.serial_port_parser = global.serial_port_connection.pipe(new Delimiter({ // CREATE THE PARSER
    delimiter: String.fromCharCode(configs.DELIM_VAL), // SET THE DELIMITING CHAR
    encoding: configs.SERIAL_ENCODING // SET THE SERIAL ENCODING
  }))

  if (callback) {
    callback(errCode)
  }
}

// CONSTRUCT THE AUTOMATIC CONNECTION BY MANUFACTURER FUNCTION
const connectByCOMAspect = function (identifierType, manufacturer, callback) {
  // LOG THAT WE ARE ATTEMPTING A CONNECTION
  console.log('Attempting to find a connection.')
  // GET ALL THE CONNECTED SERIAL PORTS
  SerialPort.list().then(function (data) {
    let checkFlag = false
    // ITERATE THROUGH THE OBJECT RETURNED FROM THE SERIALPORT CALLBACK
    data.forEach(function (port) {
      // GET THE PORT'S MANUFACTURER
      const pm = port[identifierType]
      // CHECK IF IT IS THE SAME AS MANUFACTURER
      if (typeof pm !== 'undefined' && pm.includes(manufacturer)) {
        // SET THE CHECK FLAG
        checkFlag = true
        // GET THE PATH FOR THE PORT
        data.path = port.path.toString()
        // PASS THAT PATH TO CONNECTBYPATH
        connectByPath(data, callback)
      }
    })
    // CHECK FOR THE CHECK FLAG
    if (!checkFlag && callback) {
      // SET THE ERROR CODE
      const errCode = 1
      // RETURN NO CONNECTED DEVICE CODE = 1
      callback(errCode)
    }
  })
}

/*
const constructParser = function (data, callback) {
  global.serial_port_parser.on('data', function (data) {
    // WAHH
  })
}
*/
