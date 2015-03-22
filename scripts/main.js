var bgCanvas = document.getElementById('canvas');
var topCanvas = document.getElementById('canvas1');
var ctx = bgCanvas.getContext("2d");
var topCtx = topCanvas.getContext("2d");

var crinkleDatPixelAt = function(data, max, i){
    var randomColor = Math.floor(Math.random()*max);
    data[i+0] = randomColor;
    data[i+1] = randomColor;
    data[i+2] = randomColor;
    data[i+3] = 255;
}
var drawStatic = (function(){
    var width     = 200,
        trailSize = width*2/3,
        height    = width,
        radius    = width/2,
        centerX   = width/2,
        centerY   = height/2,
        colorMax  = 145,
        xEndByRow = [];

    //precalculate the xEnd for every row
    for (var row = 0; row <= height; row++) {
        xEndByRow[row] = Math.round(Math.sqrt(Math.pow(radius,2) - Math.pow(row-centerY, 2)) + 0);
    }

    var initBackgroundMax  = 95,
        endBackgroundMax   = 110,
        backgroundColorMax = initBackgroundMax,
        backroundDirection = 0.5;

    return function (mousePosition) {
        topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        var imgData = topCtx.createImageData(width, width);

        for (var row = 0; row <= height; row++) {
            var xEnd   = xEndByRow[row],
                xStart = -xEnd + 0;
            for(var x = xStart - radius; x <= xEnd - radius; x++){
                var offset = (row * width * 4) + (x * 4);
                crinkleDatPixelAt(imgData.data, colorMax, offset);
            }
        }
        topCtx.putImageData(imgData, mousePosition.x - radius, mousePosition.y - radius);

        //draw a box in the lower context to make a "trail" like effect
        lowerImg = ctx.createImageData(trailSize, trailSize);

        backgroundColorMax += backroundDirection;
        if(backgroundColorMax > endBackgroundMax || backgroundColorMax < initBackgroundMax){
            backroundDirection *= -1;
        }

        for (i = 0 ; i < lowerImg.data.length ; i+=4 ){
            crinkleDatPixelAt(lowerImg.data, backgroundColorMax, i);
        }
        ctx.putImageData(lowerImg, mousePosition.x-(trailSize/2), mousePosition.y-(trailSize/2));

    }
}());


var drawInitialStatic = function(){
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    topCanvas.width = window.innerWidth;
    topCanvas.height = window.innerHeight;
    var imgData = ctx.createImageData(bgCanvas.width, bgCanvas.height);

    for (var i = 0 ; i < imgData.data.length ; i+=4 ){
        crinkleDatPixelAt(imgData.data, 100, i);
    }

    ctx.putImageData(imgData, 0, 0);

}

var getMousePosition = function (canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

var refresh = function (e) {
    var pos = getMousePosition(canvas, e);
    window.requestAnimationFrame(function () {
        drawStatic(pos);
    });
}

drawInitialStatic();
window.addEventListener('mousemove', refresh, false);
window.addEventListener('resize', drawInitialStatic, false);
window.requestAnimationFrame(drawStatic);
