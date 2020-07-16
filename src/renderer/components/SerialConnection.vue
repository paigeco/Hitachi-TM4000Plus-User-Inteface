<template>
<div id='connection-window'>
  <button id="connect" @click="autoConnect()">Automatically Connect</button>
  <div id='manual_conn'>
    <button id="list_devices" @click="sendListDevices()">Manually Connect</button>
  </div>
</div>
</template>

<script>

// eslint-disable-next-line prefer-const
let vm = {
  name: 'SerialConnection',
  props: {},
  methods: {
    sendListDevices: function () {
      window.ipcRenderer.send('list_connected_devices', 'NULL')
      window.ipcRenderer.on('list_connected_devices', function (event, arg) {
        vm.serialDevices = arg
      })
    },
    autoConnect: function () {
      window.ipcRenderer.send('connect_by_aspect', 'NULL')
    },
    manualConnect: function (path) {
      window.ipcRenderer.send('manual_connection', path)
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
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
