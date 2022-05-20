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
      analyser.fftSize = 512;
      var bufferLength = Math.floor(analyser.frequencyBinCount/2);
      var streamFrames = 64;
      var fft = [];
      for (let i = 0; i < streamFrames; i++) {
        fft.push(new Uint8Array(bufferLength));
      }
      source.connect(analyser);
      canvas.clearRect(0,0,canvasElem.width,canvasElem.height);
      n=0
      function draw() {
        let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
        if ((WIDTH!=canvasElem.width)||(HEIGHT!=canvasElem.height)) {
          canvasElem.width=WIDTH;
          canvasElem.height=HEIGHT;
        }
        analyser.getByteFrequencyData(fft[n]);
        n=(n+1)%streamFrames;
        let pxWidth = 1+(WIDTH/streamFrames);
        let pxHeight = 1+(HEIGHT/bufferLength);
        for (let x = 0; x < streamFrames; x++) {
          for (let y = 0; y < bufferLength; y++) {
            let c = (fft[(n+x)%streamFrames][y]-fft[(n+x-1)%streamFrames][y]);
            canvas.fillStyle = "#"+(((((0x100|Math.max(0,c))<<8)|(Math.abs(c)>>1))<<8)|Math.max(0,-c)).toString(16).substring(1);
            canvas.fillRect(x*pxWidth,y*pxHeight,pxWidth,pxHeight);
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
  errDiv.innerText += "Error:\n"+e.toString()+"\n";
  document.body.appendChild(errDiv);
}
