class Runtime {
  constructor() {
    this.canvasElem = document.createElement("canvas");
    this.errDiv = document.createElement("div");
    if (this.canvasElem.getContext) {
      this.works = true;
      this.canvasElem.style.position="absolute";
      this.canvasElem.style.top=0;
      this.canvasElem.style.left=0;
    }
    this.colors = [];
    for (let i = 0; i < 256; i++) {
      this.colors.push("#"+(((0x180|(i>>1))<<16)|(0xff^(i>>1))).toString(16).substring(1));
    }
  }
  draw() {
    let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
    this.canvasElem.width=WIDTH;
    this.canvasElem.height=HEIGHT;
    this.analyser.getByteFrequencyData(this.fft[this.n]);
    this.n=(this.n+1)%this.frames;
    let pxWidth = (WIDTH/this.frames)*2;
    let pxHeight = (HEIGHT/this.bufferLength)*2;
    for (let x = 0; x < this.frames; x++) {
      for (let y = 0; y < this.bufferLength; y++) {
        this.canvas.fillStyle = this.color[this.fft[(this.n+x)%this.frames][y]];
        this.canvas.fillRect(x*pxWidth,y*pxHeight,pxWidth,pxHeight);
      }
    }
    this.drawVisual = requestAnimationFrame(this.draw);
  }
  async graph() {
    this.stream = window.navigator.mediaDevices.getUserMedia({video: false, audio: true})
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.source = this.audioCtx.createMediaStreamSource(stream);
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.frames = 256;
    this.fft = [];
    for (let i = 0; i < this.frames; i++) {
      this.fft[i]=new Uint8Array(this.bufferLength);
    }
    this.source.connect(this.analyser);
    this.canvas.clearRect(0,0,this.canvasElem.width,this.canvasElem.height);
    this.n=0;
    this.draw();
  }
  begin() {
    try {
      if (this.works) {
        this.canvasElem.width=window.innerWidth;
        this.canvasElem.height=window.innerHeight;
        document.body.appendChild(this.canvasElem);
        this.canvas = this.canvasElem.getContext('2d');
        this.graph();
      } else {
        this.canvasElem.innerText = "Your browser does not support the canvas element and cannot run this app. Please update your browser!";
        document.body.appendChild(this.canvasElem);
      }
    } catch (e) {window.alert(e.toString());}
  }
}
window.mainClass = new Runtime();
