<template>
  <div id="serial-display-container">
    <noscript>Serial Monitor goes here</noscript>
    <div id="io-window">
      <div id="output">
      </div>
      <input id="serial-command" type="text" placeholder="Please enter your ascii to be sent here..."/>
      <button id="send">Send String</button>
    </div>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')
function init () {
  // add global variables to your web page
  window.isElectron = true
  window.ipcRenderer = ipcRenderer
}

init()

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}

// Query DOM
var packet = document.getElementById('serial-command')
var sendButton = document.getElementById('send')
var output = document.getElementById('output')

if (window.isElectron) {
  window.ipcRenderer.send('ping', 'hello main')
  window.ipcRenderer.on('pong', (event, msg) => console.log(msg))
}

// Emit events
sendButton.addEventListener('click', function () {
  console.log(packet.value)
  window.ipcRenderer.send('send_data_to_device', {
    sender: 'call',
    type: 'string',
    packet: packet.value
  })
})

// On socket chat event
window.ipcRenderer.on('recieve_data_from_device', function (data) {
  console.log(data)
  output.innerHTML += '<p><strong>' + data.sender + ": </strong>'" + data.packet + "'</p>"
})

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
