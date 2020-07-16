<template>
  <div id="app">
    <div id="webcam-window">
      <CameraMirror/>
    </div>
    <div id="serial-monitor-window">
      <SerialMonitor/>
    </div>
    <div id ="serial-connection-window">
      <SerialConnection/>
    </div>
  </div>
</template>

<script>
import CameraMirror from './components/CameraMirror.vue'
import SerialMonitor from './components/SerialMonitor.vue'
import SerialConnection from './components/SerialConnection.vue'

export default {
  name: 'App',
  components: {
    CameraMirror,
    SerialMonitor,
    SerialConnection
  }
}
</script>

<style>
#app {
  height:100%;
  width:100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  float:center;
  margin:0;
  padding:0;
  overflow: hidden;
  overflow-y : hidden;
  overflow-x : hidden
}
#webcam-window{
    float:left;
    width:67%;
    height:100%;
    position:absolute;
}

#serial-monitor-window {
    float:right;
    width:33%;
    height:100%;
    position: relative;
}
#serial-connection-window{
  top:75%;
  float:left;
  width:20%;
  height:10%;
  position: absolute;
}
</style>
