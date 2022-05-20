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
      var fft = [];
      for (let i = 0; i < streamFrames; i++) {
        fft[i]=new Uint8Array(arraySize);
      }
      source.connect(analyser);
      canvas.clearRect(0,0,canvasElem.width,canvasElem.height);
      n=0
      function draw() {
        let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
        canvasElem.width=WIDTH;
        canvasElem.height=HEIGHT;
        analyser.getByteFrequencyData(fft[n]);
        n=(n+1)%streamFrames;
        var pxWidth = WIDTH/streamFrames;
        var pxHeight = HEIGHT/bufferLength;
        let xy = 0;
        for (let x = 0; x < streamFrames; x++) {
          for (let y = 0; y < bufferLength; y++) {
            let c = fft[(n+x)%streamFrames][y]
            canvas.fillStyle = "#"+((((((0x100|c)<<8)|c)<<8)|c).toString(16).substring(1));
            canvas.fillRect(x*pxWidth,y*pxHeight,pxWidth,pxHeight);
            xy++;
          }
        }
        var drawVisual = requestAnimationFrame(draw);
      }
      draw()
    });
  } else {
    canvasElem.innerText = "Your browser does not support the canvas element and cannot run this app. Please update your browser!";
  }
} catch (e) {
  canvasElem.innerText = "Error:\n"+e.toString();
}
