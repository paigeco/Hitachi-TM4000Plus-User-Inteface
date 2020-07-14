<template>
  <div id="app">
      <div id="wrapper">
        <div id="webcam-window">
            <CameraMirror/>
        </div>
        <div id="serial-window">
            <SerialMonitor/>
        </div>
      </div>
      <div id="welcomen">
      <HelloWorld id = "greet" msg="Welcome to the App"/>
      </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import CameraMirror from './components/CameraMirror.vue'
import SerialMonitor from './components/SerialMonitor.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    CameraMirror,
    SerialMonitor
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
    width:66%;
    height:100%;
}

#serial-window {
    float:right;
    width:33%;
    height:100%;
}
#welcomen{
    float:bottom;
    width:100%;
    height:10%;
}
</style>
