var canvasElem = document.createElement("canvas");
var errDiv = document.createElement("div");
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
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      var streamFrames = 64;
      var fft = [];
      for (let i = 0; i < streamFrames; i++) {
        fft[i]=new Uint8Array(bufferLength);
      }
      source.connect(analyser);
      canvas.clearRect(0,0,canvasElem.width,canvasElem.height);
      n=0
      function draw() {
        try {
          let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
          canvasElem.width=WIDTH;
          canvasElem.height=HEIGHT;
          analyser.getByteFrequencyData(fft[n]);
          n=(n+1)%streamFrames;
          let pxWidth = (WIDTH/streamFrames)*2;
          let pxHeight = (HEIGHT/bufferLength)*2;
          for (let x = 0; x < streamFrames; x++) {
            for (let y = 0; y < bufferLength; y++) {
              let c = fft[Math.floor((((n+x)%streamFrames)+streamFrames)%streamFrames)][y];
              canvas.fillStyle = "#"+(((0x010101*c)|0x1000000).toString(16).substring(1));
              canvas.fillRect(x*pxWidth,y*pxHeight,pxWidth,pxHeight);
            }
          }
          var drawVisual = requestAnimationFrame(draw);
        } catch (e) {alert(e.toString());}
      }
      draw()
    });
  } else {
    canvasElem.innerText = "Your browser does not support the canvas element and cannot run this app. Please update your browser!";
  }
} catch (e) {alert(e.toString());}
