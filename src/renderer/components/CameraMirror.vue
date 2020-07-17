<template>
<div id = "camera-container">
  <noscript>This html canvas requires JS to run</noscript>
    <!--<button id="get-ports">{{connected_serial_port_array}}</button>-->
    <canvas id="webcam-mirroring-canvas" height="1080" width="1920" ></canvas>

</div>
</template>

<script>

export default {
  name: 'CameraMirror',
  props: {
    viewport_center_percent: { center_x: 0, center_y: 0 },
    viewport_size_percent: { size_x: 0, size_y: 0 },
    crosshair_center_percent: { center_x: 0, center_y: 0 }
  }
}

// console.log(props.viewport_center_percent)
// Put event listeners into place
window.addEventListener('DOMContentLoaded', function () {
  let offsetX = 0
  let offsetY = 0

  function init () {
    // add global variables to your web page
    window.ipcRenderer.on('x_update', function (event, arg) {
      console.log(arg)
      offsetX = 511 - parseInt(arg, 10)
    })
    window.ipcRenderer.on('y_update', function (event, arg) {
      offsetY = 511 - parseInt(arg, 10)
    })
  }

  init()

  // Grab elements, create settings, etc.
  var canvas = document.getElementById('webcam-mirroring-canvas')
  var ctx = canvas.getContext('2d')
  // we don't need to append the video to the document
  var video = document.createElement('video')
  var videoObj = navigator.getUserMedia || navigator.mozGetUserMedia // our browser is up to date with specs ?
    ? {
      video: {
        width: { min: 1280, max: 1280 },
        height: { min: 720, max: 720 },
        require: ['width', 'height']
      }
    }
    : {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 1280,
          maxHeight: 720
        }
      }
    }
  var errBack = function (error) {
    console.log('Video capture error: ', error.code)
  }
  // create a crop object that will be calculated on load of the video
  var crop
  // create a variable that will enable us to stop the loop.
  var raf

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
  // Put video listeners into place
  navigator.getUserMedia(videoObj, function (stream) {
    video.srcObject = stream
    video.onplaying = function () {
      var croppedWidth = (Math.min(video.videoHeight, canvas.height) / Math.max(video.videoHeight, canvas.width * 0.5625)) * Math.min(video.videoWidth, canvas.width)
      var croppedX = (video.videoWidth - croppedWidth) / 2
      crop = { w: video.videoWidth, h: video.videoHeight, x: croppedX, y: 0 }
      // call our loop only when the video is playing
      raf = requestAnimationFrame(loop)
    }
    video.onpause = function () {
      // stop the loop
      cancelAnimationFrame(raf)
    }
    video.play()
  }, errBack)

  ctx.lineWidth = 5
  ctx.strokeStyle = 'lime'
  ctx.save()

  function loop () {
    raf = requestAnimationFrame(loop)
    ctx.drawImage(video, 0, 0, crop.w, crop.h, 0, 0, canvas.width, canvas.width * 0.5625)

    // center
    var x = (canvas.width / 2) + offsetY
    var y = (canvas.height / 2) + offsetX

    // remove aliasing
    x = Math.floor(x) + 0.5
    y = Math.floor(y) + 0.5

    ctx.beginPath()
    ctx.moveTo(x, y - 50)
    ctx.lineTo(x, y + 50)

    ctx.moveTo(x - 50, y)
    ctx.lineTo(x + 50, y)
    ctx.stroke()
  }
  // now that our video is drawn correctly, we can do...
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
}, false)
</script>

<style scoped>
#webcam-mirroring-canvas{
    float:left;
    width:100%;
    max-width: 100;
    border: 3px solid darkgrey;
    margin:0px;
}
</style>
