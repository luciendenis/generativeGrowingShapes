// To ensure we use native resolution of screen
var dpr = window.devicePixelRatio || 1;

/** @type {HTMLCanvasElement} */
const renderingCanvas = document.getElementById('renderingCanvas');
renderingCanvas.width = window.innerWidth*dpr;
renderingCanvas.height = window.innerHeight*dpr;
const ctxRC = renderingCanvas.getContext('2d');
ctxRC.scale(dpr,dpr); // to scale every drawing operations
/** @type {HTMLCanvasElement} */
const backgroundCanvas = document.getElementById('backgroundCanvas');
backgroundCanvas.width = window.innerWidth*dpr;
backgroundCanvas.height = window.innerHeight*dpr;
const ctxBC = backgroundCanvas.getContext('2d');
ctxBC.scale(dpr,dpr); // to scale every drawing operations


// constants
const rootBaseDx = 1;
const rootBaseDy = 1;
const rootBaseSize = .2;
const rootRanSize = .9;
const rootRanDs = .05;
const rootBaseDs = .1;
const rootBaseMaxSize = 3;
const rootRanMaxSize = 10;
const rootBaseAngle = 6.2;
const rootBaseDa = .5;
const rootRanDrawAngleSpeed = .03;
const rootBaseDrawAngleSpeed = .05;
const rootColorAngle = 200;
const rootColorLightness = 50;
const rootColorSaturation = 100;
const rootLightnessMin = 30;
const rootLightnessMax = 95;
const rootLightnessGrowingRate = .7;
const rootCountPerCluster = 5;
const shadowOpacity = .9;
const shadowColorAngle = 200;
const shadowColorLightness = 20;
const shadowColorSaturation = 20;
const strokeSizeModifier1 = 2;
const strokeSizeModifier2 = 3;
const strokeLineWidth1 = .05;
const strokeLineWidth2 = .02;
const strokeCount = 2;
const drawSizeChangeValue = 0;
const drawSizeMin = .3;
const drawSizeMax = 1.5;


// variables
var drawing = false;
var currentClusterDrawSize = 1;

ctxBC.fillStyle = 'hsl(' + rootColorAngle + ',' + rootColorSaturation + '%,' + rootLightnessMax + '%)';
ctxBC.fillRect(0,0,renderingCanvas.width, renderingCanvas.height);

ctxRC.lineWidth = .1;
ctxRC.shadowOffsetX = 10;
ctxRC.shadowOffsetY = 10;
ctxRC.shadowBlur = 30;
ctxRC.shadowColor = 'hsla(' + shadowColorAngle + ',' + shadowColorSaturation + '%,' + shadowColorLightness + '%,' + shadowOpacity + ')';
ctxRC.globalCompositeOperation = 'destination-over';


class RootCluster{
  constructor(x,y,size,count){
    this.x = x;
    this.y = y;
    this.size = size;
    this.count = count;
  }

  draw(){
    for(let i = 0; i < this.count; i++){
      const root = new Root(this.x, this.y, this.size);
      root.update();
    }
  }
}

class Root{
  constructor(x,y,size){
    this.x = x;
    this.y = y;
    this.dX = Math.random() * rootBaseDx * 2 - rootBaseDx;
    this.dY = Math.random() * rootBaseDy * 2 - rootBaseDy;
    this.maxSize = (Math.random() * rootRanMaxSize + rootBaseMaxSize) * size;
    this.size = Math.random() * rootRanSize + rootBaseSize;
    this.dS = Math.random() * rootRanDs + rootBaseDs;
    this.angleX = Math.random() * rootBaseAngle;
    this.dAX = Math.random() * rootBaseDa * 2 - rootBaseDa;
    this.angleY = Math.random() * rootBaseAngle;
    this.dAY = Math.random() * rootBaseDa * 2 - rootBaseDa;
    this.angle = 0;
    this.dA = Math.random() * rootRanDrawAngleSpeed + rootBaseDrawAngleSpeed;
    this.lightness = rootLightnessMax;
    this.opacity = 1;
    this.shape = Math.random() < .5 ? 0 : 1;
  }
  update(){
    this.x += this.dX + Math.sin(this.angleX);
    this.y += this.dY + Math.sin(this.angleY);
    this.size += this.dS;
    this.angleX += this.dAX;
    this.angleY += this.dAY;
    this.angle += this.dA;

    if(this.lightness < rootLightnessMax){
      this.lightness += rootLightnessGrowingRate;
    }
    this.opacity = 1 - this.size / this.maxSize;

    if(this.size < this.maxSize){
      this.draw();
      requestAnimationFrame(this.update.bind(this));
    }
  }
  draw(){
    if(this.shape == 0){
      this.drawCircle();
    }
    else if(this.shape == 1){
      this.drawSquare();
    }
  }
  drawCircle(){
    ctxRC.beginPath();
    ctxRC.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctxRC.fillStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + this.lightness + '%,' + this.opacity + ')';
    ctxRC.fill();
    if(strokeCount > 0){
      ctxRC.strokeStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + this.lightness + '%,' + this.opacity + ')';
      ctxRC.lineWidth = strokeLineWidth1;
      ctxRC.beginPath();
      ctxRC.arc(this.x, this.y, this.size * strokeSizeModifier1, 0, Math.PI*2);
      ctxRC.stroke();
    }
    if(strokeCount > 1){
      ctxRC.strokeStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + this.lightness + '%,' + this.opacity + ')';
      ctxRC.lineWidth = strokeLineWidth2;
      ctxRC.beginPath();
      ctxRC.arc(this.x, this.y, this.size * strokeSizeModifier2, 0, Math.PI*2);
      ctxRC.stroke();
    }
  }
  drawSquare(){
    ctxRC.save();
    ctxRC.translate(this.x, this.y);
    ctxRC.rotate(this.angle);
    ctxRC.fillStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + this.lightness + '%,' + this.opacity + ')';
    ctxRC.fillRect(0 - this.size / 2, 0 - this.size / 2, this.size, this.size);
    if(strokeCount > 0){
      let strokeSize1 = this.size * strokeSizeModifier1;
      ctxRC.strokeStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + rootLightnessMin + '%,' + this.opacity + ')';
      ctxRC.lineWidth = strokeLineWidth1;
      ctxRC.strokeRect(0 - strokeSize1 / 2, 0 - strokeSize1 / 2, strokeSize1, strokeSize1);
    }
    if(strokeCount > 1){
      let strokeSize2 = this.size * strokeSizeModifier2;
      ctxRC.strokeStyle = 'hsla(' + rootColorAngle + ',' + rootColorSaturation + '%,' + rootLightnessMax + '%,' + this.opacity + ')';
      ctxRC.lineWidth = strokeLineWidth2;
      ctxRC.strokeRect(0 - strokeSize2 / 2, 0 - strokeSize2 / 2, strokeSize2, strokeSize2);
    }
    ctxRC.restore();
  }
}

function updateDrawSize(){
  if(drawSizeChangeValue != 0){
    let newSize = currentClusterDrawSize + drawSizeChangeValue;
    if(newSize > drawSizeMin && newSize < drawSizeMax){
      currentClusterDrawSize += drawSizeChangeValue;
    }
  }
}

window.addEventListener('mousemove', function(e){
  if(drawing){
    updateDrawSize();
    const cluster = new RootCluster(e.x, e.y, currentClusterDrawSize, rootCountPerCluster);
    cluster.draw();
  }
})
window.addEventListener('mousedown', function(e){
  drawing = true;
  currentClusterDrawSize = 1;
  const cluster = new RootCluster(e.x, e.y, currentClusterDrawSize, rootCountPerCluster);
  cluster.draw();
  }
)
window.addEventListener('mouseup', function(e){
  drawing = false;
  }
)
window.addEventListener('touchstart',
  function(e){
    drawing = true;
    currentClusterDrawSize = 1;
    const cluster = new RootCluster(e.x, e.y, currentClusterDrawSize, rootCountPerCluster);
    cluster.draw();
  }
, false);

window.addEventListener('touchend',
  function(e){
    drawing = false;
  }
, false);
window.addEventListener('touchmove',
  function(e){
    if(drawing){
      updateDrawSize();
      const cluster = new RootCluster(e.touches[0].clientX, e.touches[0].clientY, currentClusterDrawSize, rootCountPerCluster);
      cluster.draw();
    }
  }
, false);
