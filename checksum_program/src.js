// Query DOM
var packet = document.getElementById('serial-command')
var sendButton = document.getElementById('send')
var output = document.getElementById('output')

function checksumFromString (inString) {
  // GET ESSENTIALLY A CHAR ARRAY
  const arr = []
  for (var i = 0; i < inString.length; i++) {
    arr.push(inString.charCodeAt(i))
  }
  // GET THE SUM OF THE ARRAY
  const checksumInt = arr.reduce((a, b) => a + b, 0) & 0xFF
  // GET THE CHECKSUM STRING
  const checksumString = (String.fromCharCode(checksumInt))

  return checksumString
}

// Emit events
sendButton.addEventListener('click', function () {
  const test = checksumFromString(packet.value)
  output.innerHTML += '<p><strong>Output: </strong>' + test + '</p>'
})
