// IMPORT NODE STUFF
const SerialPort = require('serialport')
const Delimiter = SerialPort.parsers.Delimiter

// IMPORT THE CONFIGS FROM THE CONFIGS FILE
const configs = require('./app_config.json')

// CONSTRUCT THE READ PORTS FUNCTION
const readPortsObject = function (callback) {
  // query the device for ports
  SerialPort.list().then(function (data) {
    if (callback) {
      callback(data)
    } else {
      throw Error('This function requires a callback')
    }
  })
}

// CONSTRUCT THE MANUAL CONNECTION FUNCTION
const connectByPath = function (comPath, callback) {
  // CONNECT FROM PATH

  // MAKE A SERIAL PORT CONNECTION FOR WRITING
  global.serial_port_connection = new SerialPort(comPath, {
    baudRate: configs.BAUD // SET THE BAUD RATE
  }, function (data) {
    // UPON THE OPENING OF THE PORT LOG IT
    console.log('opening a connection to the device on port: ', comPath)
  })

  global.serial_port_connection.on('open', function () {
    console.log('connection done! now connected at port: ' + comPath)
  })

  // setup a parser for the given port
  global.serial_port_parser = global.serial_port_connection.pipe(new Delimiter({ // CREATE THE PARSER
    delimiter: String.fromCharCode(configs.DELIM_VAL), // SET THE DELIMITING CHAR
    encoding: configs.SERIAL_ENCODING // SET THE SERIAL ENCODING
  }))

  if (callback) {
    callback()
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
        const comPath = port.path.toString()
        // PASS THAT PATH TO CONNECTBYPATH
        connectByPath(comPath, callback)
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

const constructParser = function (data, callback) {
  global.serial_port_parser.on('data', function (data) {
    // WAHH
  })
}

module.exports = {
  readPortsObject: readPortsObject,
  connectByPath: connectByPath,
  connectByCOMAspect: connectByCOMAspect,
  constructParser: constructParser
}
