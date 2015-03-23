var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");

var crinkleDatPixelAt = function(data, max, i){
    var randomColor = Math.floor(Math.random()*max);
    data[i+0] = randomColor;
    data[i+1] = randomColor;
    data[i+2] = randomColor;
    data[i+3] = 255;
};

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
        backgroundColorMax += backroundDirection;
        if(backgroundColorMax > endBackgroundMax || backgroundColorMax < initBackgroundMax){
            backroundDirection *= -1;
        }

    return function (mousePosition) {

        for (var row = 0; row <= height; row++) {
            var xEnd   = xEndByRow[row],
                xStart = -xEnd + 0;
            if (xEnd != 0 && xStart != 0){
                var imgData = ctx.createImageData((Math.abs(xStart) + Math.abs(xEnd)), 1 );
                for(var i = 0; i <= imgData.data.length ; i+= 4){
                    crinkleDatPixelAt(imgData.data, backgroundColorMax, i)
                }
                ctx.putImageData(imgData, mousePosition.x - (imgData.data.length / 8), mousePosition.y + row - radius);
            }

        }

    };
}());

var drawInitialStatic = function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var imgData = ctx.createImageData(canvas.width, canvas.height);

    for (var i = 0 ; i < imgData.data.length ; i += 4){
        crinkleDatPixelAt(imgData.data, 100, i);
    }

    ctx.putImageData(imgData, 0, 0);

};

var drawRainbow = function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var imgData = ctx.createImageData(canvas.width, canvas.height);

    var redInit =  255;
    var greenInit = 0;
    var blueInit = 0;

    var previousRed;
    var previousGreen;
    var previousBlue;

    var red = 255,
    green = 0,
    blue = 0,
    alpha = 255;

    for (var i = 0; i < imgData.data.length ; i += 4){

        if (i != 0){
            previousRed = imgData.data[i - 4 + 0];
            previousGreen = imgData.data[i - 4 + 1];
            previousBlue = imgData.data[i - 4 + 2];
        } else {
            previousRed = redInit;
            previousGreen = greenInit;
            previousBlue = blueInit;
        }

        if (previousRed == 255 && previousBlue < 255 && previousGreen == 0){
           blue = previousBlue + 1;
            console.log('i tried to increment blue to', blue);
         } else if (previousRed > 0 && previousBlue == 255 && previousGreen == 0){
            red = previousRed - 1;
            console.log('i tried to decrement red to', red);
        } else if (previousRed == 0 && previousBlue == 255 && previousGreen < 255){
            green = previousGreen + 1;
        } else if (previousRed == 0 && previousBlue > 0 && previousGreen == 255){
            blue = previousBlue - 1;
        } else if (previousRed < 255 && previousBlue == 0 && previousGreen == 255){
            red = previousRed + 1;
        } else {
            previousRed = redInit;
            previousGreen = greenInit;
            previousBlue = blueInit;
            red = previousRed;
            green = previousGreen;
            blue = previousBlue;
        }
        imgData.data[i+0] = red;//dunno;
        imgData.data[i+1] = green;//dunno;
        imgData.data[i+2] = blue;//dunno;
        imgData.data[i+3] = alpha;
    }

    ctx.putImageData(imgData, 0, 0);
}

var getMousePosition = function (canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

var refresh = function (e) {
    var pos = getMousePosition(canvas, e);
    window.requestAnimationFrame(function () {
        drawStatic(pos);
    });
}

var showSecret = function (e){
    var pos = getMousePosition(canvas, e);
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (pos.x < (width / 2) + 100 && pos.x > (width / 2) - 100 && pos.y < (height /2) + 100 && pos.y > (height/2) - 100){
        console.log('secret trigger + 1');
        secretTrigger ++;
    }
    if (secretTrigger > 50){
        console.log('reveal secret');
    }
};

drawInitialStatic();
var secretTrigger = 0;
window.addEventListener('mousemove', refresh, false);
window.addEventListener('mousemove', showSecret, false);
window.addEventListener('resize', drawInitialStatic, false);
window.requestAnimationFrame(drawStatic);

window.requestAnimationFrame(drawRainbow);
