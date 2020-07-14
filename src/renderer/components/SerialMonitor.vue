<template>
  <div id="serial-display-container" style="float:top;">
    <noscript>Serial Monitor goes here</noscript>
    <div id="io-window">
      <div id="communication_window">
        <ul>
          <li v-for="item in communicationLog" :key="item.sender">
              <div v-bind:style="item.color">{{ item.sender }}:  {{ item.message }}</div>
          </li>
        </ul>
      </div>
      <input id="serial-command" type="text" placeholder="Please enter your ascii to be sent here..."/>
      <button id="send" @click="sendMsg()">Send</button>
    </div>
    <button id="connect" @click="autoConnect()">Automatically Connect</button>
    <div id='manual_conn'>
      <button id="list_devices" @click="sendListDevices()">Manually Connect</button>
    </div>
      <ul v-if="serialDevices">
        <li v-for="device in serialDevices" :key="device.path">
          <button @click="sendListDevices(device.path)">{{ device.path }}</button>
        </li>
      </ul>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')

function init () {
  // add global variables to your web page
  window.isElectron = true
  window.ipcRenderer = ipcRenderer
  window.ipcRenderer.on('data_recieved', function (event, arg) {
    vm.communicationLog.push({ sender: 'From Device', message: arg, color: 'red' })
  })
}

init()

// eslint-disable-next-line prefer-const
let vm = {
  props: {},
  communicationLog: [],
  serialDevices: false,
  data () {
    return {
      communicationLog: vm.communicationLog,
      serialDevices: vm.serialDevices
    }
  },
  methods: {
    sendListDevices: function () {
      window.ipcRenderer.send('list_connected_devices', 'NULL')
      window.ipcRenderer.on('list_connected_devices', function (event, arg) {
        vm.serialDevices = arg
      })
    },
    sendMsg: function () {
      var stringInput = document.getElementById('serial-command')
      vm.communicationLog.push({ sender: 'To Device', message: stringInput.value, color: 'blue' })
      window.ipcRenderer.send('send_data', stringInput.value)
    },
    autoConnect: function () {
      window.ipcRenderer.send('connect_by_aspect', 'NULL')
    },
    manualConnect: function (path) {
      window.ipcRenderer.send('manual_connection', path)
    },
    created () {
    }
  }
}

export default vm

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  overflow:hidden;
  overflow-y:scroll;
  height:100%
}
li {
  margin: 10px;
  float: left;
  width: 100%;
  text-align: left;
}
a {
  color: #42b983;
}
#serial-command {
  float: left;
  width: 75%;
  margin: 0px;
}
#send {
  float: right;
  width: 20%;
  margin: 0px;
}
</style>
