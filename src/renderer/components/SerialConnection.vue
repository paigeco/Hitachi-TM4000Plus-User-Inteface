<template>
<div id='connection-window'>
  <button id="connect" @click="autoConnect()">Automatically Connect</button>
  <button v-if="serialDevices==null" id="list_devices" @click="sendListDevices()">Show Devices</button>
  <ul>
    <li v-for="device in serialDevices" :key="device.path">
      <button @click="manualConnect(device.path)">{{ device.path }}: {{device.manufacturer}}</button>
    </li>
  </ul>
</div>
</template>

<script>

// eslint-disable-next-line prefer-const
export default {
  name: 'SerialConnection',
  data () {
    return {
      serialDevices: null,
      connected: false
    }
  },
  methods: {
    checkConnection: function () {
      window.ipcRenderer.send('is_connected', 'NULL')
      window.ipcRenderer.on('is_connected', (event, arg) => {
        if (arg !== '') { this.connected = true } else { this.connected = false };
      })
    },
    sendListDevices: function () {
      window.ipcRenderer.send('list_connected_devices', 'NULL')
      window.ipcRenderer.on('list_connected_devices', (event, arg) => {
        this.serialDevices = arg
      })
    },
    autoConnect: function () {
      window.ipcRenderer.send('connect_by_aspect', 'NULL')
    },
    manualConnect: function (path) {
      window.ipcRenderer.send('manual_connection', path)
    },
    mounted: function () { this.checkConnection() }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  float:left;
  width: 100%;
  margin: 0px;
}
li {
  display: inline-block;
  margin: 0px;
  width: 100%;
}
button {
  float: left;
  width: 100%
}
a {
  color: #42b983;
}
</style>
