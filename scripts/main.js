var bgCanvas = document.getElementById('canvas');
var topCanvas = document.getElementById('canvas1');
var ctx = bgCanvas.getContext("2d");
var topCtx = topCanvas.getContext("2d");

var drawStatic = function (mousePosition) {
    var width = 200;
    var imgData = topCtx.createImageData(width, width);
    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);

    var crinkleDatPixelAt = function(i){
        var randomColor = Math.floor(Math.random()*100)
        imgData.data[i+0] = randomColor;
        imgData.data[i+1] = randomColor;
        imgData.data[i+2] = randomColor;
        imgData.data[i+3] = 255;
    }
    
    var width   = 200,
        height  = width,
        radius  = width/2 - 2,
        centerX = width/2,
        centerY = height/2;

    for (var row = 0; row <= height; row++){
        //these values could be cached in an array where the index was row:
        // and row might need to be corrected since it comes from the top, with something like height-row, but it could also work fine
        var xEnd = Math.round(Math.sqrt(Math.pow(radius,2) - Math.pow(row-centerY, 2)) + 0),
            xStart   = -xEnd + 0;
        for(var x = xStart - 100; x <= xEnd - 100; x++){
            crinkleDatPixelAt((row * width * 4) + (x * 4));
        }
    }

    topCtx.putImageData(imgData, mousePosition.x - 100, mousePosition.y - 100);
}

var drawInitialStatic = function(){
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    topCanvas.width = window.innerWidth;
    topCanvas.height = window.innerHeight;
    var imgData = ctx.createImageData(bgCanvas.width, bgCanvas.height);

    for (var i = 0 ; i < imgData.data.length ; i+=4 ){
        var randomColor = Math.floor(Math.random()*100)
        imgData.data[i+0] = randomColor;
        imgData.data[i+1] = randomColor;
        imgData.data[i+2] = randomColor;
        imgData.data[i+3] = 255;
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
