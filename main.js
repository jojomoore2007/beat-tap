var canvasElem = document.getElementById("canvas");
if (canvasElem.getContext) {
  var canvas = canvasElem.getContext('2d');
  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream=>{
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;
    var fft = new Float32Array(analyzer.frequencyBinCount);
    
  })
}
