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

    //animation stuff
    var defaultFrame = {
            red: 0,
            blue: 0,
            green: 0,
            alpha: 0,
            count: 255
        },
        frames = [
            { blue: 1},
            { red: -1},
            { green: 1},
            { blue: -1},
            { green: -1},
            { red: 255, count:1}
        ].map(function(obj){
            return Object.assign({}, defaultFrame, obj);
        }),
        currentCount = 0,
        currentValues = {
            red: 255,
            blue: 0,
            green: 0,
            alpha: 255
        },
        frameIndex = 0;

    return function (mousePosition) {

        var frame = frames[frameIndex];

        currentCount += 1;
        if (currentCount > frame.count){
            currentCount = 0;
            frameIndex = (frameIndex + 1) % (frames.length );
        }
        //apply current frame
        Object.keys(currentValues).forEach(function(key){
            currentValues[key] += frame[key] || 0;
        })

        for (var row = 0; row <= height; row++) {
            var xEnd   = xEndByRow[row],
                xStart = -xEnd + 0;
            if (xEnd != 0 && xStart != 0){
                var imgData = ctx.createImageData((Math.abs(xStart) + Math.abs(xEnd)), 1 );
                for(var i = 0; i <= imgData.data.length ; i+= 4){
                    imgData.data[i+0] = currentValues.red;
                    imgData.data[i+1] = currentValues.green;
                    imgData.data[i+2] = currentValues.blue;
                    imgData.data[i+3] = currentValues.alpha;
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

    for (var i = 0 ; i < imgData.data.length ; i+=4 ){
        crinkleDatPixelAt(imgData.data, 100, i);
    }

    ctx.putImageData(imgData, 0, 0);

};

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

drawInitialStatic();
window.addEventListener('mousemove', refresh, false);
window.addEventListener('resize', drawInitialStatic, false);
window.requestAnimationFrame(drawStatic);
