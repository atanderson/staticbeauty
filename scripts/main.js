var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d"),
imgData = ctx.createImageData(canvas.width, canvas.height);

var drawStatic = function (mousePosition) {
    var width = 200;
    var imgData = ctx.createImageData(width, width);

    // for (i = 0 ; i < imgData.data.length ; i+=4 ){
    //     var randomColor = Math.floor(Math.random()*100)
    //     imgData.data[i+0] = randomColor;
    //     imgData.data[i+1] = randomColor;
    //     imgData.data[i+2] = randomColor;
    //     imgData.data[i+3] = 255;
    // }

    var width   = 200,
        height  = width,
        radius  = width/2,
        centerX = width/2,
        centerY = height/2;

    var crinkleDatPixelAt = function(i){
        var randomColor = Math.floor(Math.random()*100)
        imgData.data[i+0] = randomColor;
        imgData.data[i+1] = randomColor;
        imgData.data[i+2] = randomColor;
        imgData.data[i+3] = 255;
    }

    for (var row = 0; row < radius; row++){
        //these values could be cached in an array where the index was row:
        // and row might need to be corrected since it comes from the top, with something like height-row, but it could also work fine
        var xStart = Math.sqrt(Math.pow(radius,2) - Math.pow(row-centerY, 2) + centerX),
            xEnd   = width - xStart;
        for(var x = xStart; x <= xEnd; x++){
            crinkleDatPixelAt(row * width * 4 + x * 4);
        }
    }

    ctx.putImageData(imgData, mousePosition.x - 100, mousePosition.y - 100);
}

var drawInitialStatic = function(){
    var imgData = ctx.createImageData(canvas.width, canvas.height);

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
window.requestAnimationFrame(drawStatic);