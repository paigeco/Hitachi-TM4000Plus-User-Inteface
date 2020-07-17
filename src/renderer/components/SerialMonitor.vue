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
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')
window.isElectron = true
window.ipcRenderer = ipcRenderer

// eslint-disable-next-line prefer-const
export default {
  props: {},
  name: 'SerialMonitor',
  data () {
    return {
      communicationLog: []
    }
  },
  methods: {
    sendMsg: function () {
      var stringInput = document.getElementById('serial-command')
      this.communicationLog.push({ sender: 'To Device', message: stringInput.value, color: 'blue' })
      window.ipcRenderer.send('send_data', stringInput.value)
    },
    initReciever: function () {
      window.ipcRenderer.on('data_recieved', function (event, arg) {
        this.communicationLog.push({ sender: 'From Device', message: arg, color: 'red' })
      })
    },
    mounted: function () {
      this.initReciever()
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  overflow-x:hidden;
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
  width: 80%;
  margin: 0px;
}
#send {
  float: right;
  width: 20%;
  margin: 0px;
}
</style>
