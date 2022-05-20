var canvasElem = document.createElement("canvas");
try {
  if (canvasElem.getContext) {
    canvasElem.style.position="absolute";
    canvasElem.style.top=0;
    canvasElem.style.left=0;
    canvasElem.width=window.innerWidth;
    canvasElem.height=window.innerHeight;
    document.body.appendChild(canvasElem);
    var canvas = canvasElem.getContext('2d');
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream=>{
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var analyser = audioCtx.createAnalyser();
      var source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      var streamFrames = 64;
      var arraySize = bufferLength*streamFrames;
      var fft = new Uint8Array(arraySize);
      var copyLength = arraySize-bufferLength;
      source.connect(analyser);
      canvas.clearRect(0,0,canvasElem.width,canvasElem.height);
      function draw() {
        let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
        canvasElem.width=WIDTH;
        canvasElem.height=HEIGHT;
        fft.copyWithin(bufferLength,0,copyLength);
        analyser.getByteFrequencyData(fft);
        var pxWidth = WIDTH/streamFrames;
        var pxHeight = HEIGHT/bufferLength;
        for (let x = 0; x < streamFrames; x++) {
          for (let y = 0; y < bufferLength; y++) {
            
          }
        }
      }
    });
  } else {
    canvasElem.innerText = "Your browser does not support the canvas element and cannot run this app. Please update your browser!";
  }
} catch (e) {
  canvasElem.innerText = "Error:\n"+e.toString();
}
