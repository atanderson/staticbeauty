//Required to 'write' to the canvas
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");

//Sets the data subset representing a pixel to a random greyscale value
var crinkleDatPixelAt = function(data, max, i){

    var randomColor = Math.floor(Math.random()*max);
    data[i+0] = randomColor; //Red
    data[i+1] = randomColor; //Green
    data[i+2] = randomColor; //Blue
    data[i+3] = 255;         //Alpha

};

//Generates a circle of randomized pixels and writes it at the cursor position
var drawStatic = (function(){

    //Define the circle. Units are pixels unless noted otherwise
    //?ANDREW: do we need all these, some are redundant
    var width     = 200,       
        height    = width,     
        radius    = width/2,   
        centerX   = width/2,
        centerY   = height/2;

    //Starting from the top of the circle, determine now long the row of pixels
    //should be using the circle equation 
    var xEndByRow = [];
    for (var row = 0; row <= height; row++) {
        xEndByRow[row] = Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(row-centerY, 2)) + 0);
    }

    //Brightness bounds used for oscillating static 'color' effect
    var initBackgroundMax  = 95,
        endBackgroundMax   = 110,
        backgroundColorMax = initBackgroundMax,
        backroundDirection = 0.5;

    return function (mousePosition) {

        //Increment the pixel color bounds
        backgroundColorMax += backroundDirection;
        //If the color bounds exceeds the max, begin decrementing it
        if(backgroundColorMax > endBackgroundMax || backgroundColorMax < initBackgroundMax){
            backroundDirection *= -1;
        }
        
        //Starting from the top of the circle, draw the row of pixels and place
        //them so the circle is centered on the cursor.
        for (var row = 0; row <= height; row++) {

            //Get the pre-set length of the row of pixels
            var xEnd   = xEndByRow[row],
                xStart = -xEnd;

            //?ANDREW can't remember why/if this if statement is necessary
            if (xEnd != 0 && xStart != 0){

                //Create an imgData array that is 1 pixel tall
                var imgData = ctx.createImageData(Math.abs(xStart) + xEnd, 1 );
                //randomize every pixel within the imgData row
                for(var i = 0; i <= imgData.data.length ; i+= 4){
                    crinkleDatPixelAt(imgData.data, backgroundColorMax, i)
                }

                //Draw the circle relative to the cursor. NOTE: we divide by 8
                //to turn the clamped array into 'pixels' then find the center
                ctx.putImageData(imgData, mousePosition.x - (imgData.data.length / 8), mousePosition.y + row - radius);
            }

        }

    };
}());

//Draw a randomized canvas of pixels that is the size of the browser window
var drawInitialStatic = function(){

    //Dimensions of the browser window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //NOTE: Suspected to be taxing to generate
    var imgData = ctx.createImageData(canvas.width, canvas.height);

    for (var i = 0 ; i < imgData.data.length ; i += 4){
        crinkleDatPixelAt(imgData.data, 100, i);
    }

    ctx.putImageData(imgData, 0, 0);

};

//ANDREW: This is experimental
var drawRainbow = function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var rowWidth = canvas.width;
    var previousRed;
    var previousGreen;
    var previousBlue;

    for (var pxFromTop = 0; pxFromTop <= canvas.height; pxFromTop += 1){

        var red = 255,
        green = 0,
        blue = 0,
        alpha = 255;

        var imgData = ctx.createImageData(rowWidth, 1);
        for (var i = 0; i < imgData.data.length ; i += 4){

            if (i != 0){
                previousRed = imgData.data[i - 4 + 0];
                previousGreen = imgData.data[i - 4 + 1];
                previousBlue = imgData.data[i - 4 + 2];
            } else {
                previousRed = red;
                previousGreen = green;
                previousBlue = blue;
            }

            if (previousRed == 255 && previousBlue < 255 && previousGreen == 0){
                blue = previousBlue + 1;
            } else if (previousRed > 0 && previousBlue == 255 && previousGreen == 0){
                red = previousRed - 1;
            } else if (previousRed == 0 && previousBlue == 255 && previousGreen < 255){
                green = previousGreen + 1;
            } else if (previousRed == 0 && previousBlue > 0 && previousGreen == 255){
                blue = previousBlue - 1;
            } else if (previousRed < 255 && previousBlue == 0 && previousGreen == 255){
                red = previousRed + 1;
            } else if (previousRed == 255 && previousBlue == 0 && previousGreen > 0){
                green = previousGreen - 1 
            }

            imgData.data[i+0] = red;//dunno;
            imgData.data[i+1] = green;//dunno;
            imgData.data[i+2] = blue;//dunno;
            imgData.data[i+3] = 255;
        }

        ctx.putImageData(imgData, 0, pxFromTop);

    }

}

//Return the mouse position in the window
var getMousePosition = function (canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

//Function used to bind drawStatic to recurring events
var refresh = function (e) {
    var pos = getMousePosition(canvas, e);
    window.requestAnimationFrame(function () {
        drawStatic(pos);
    });
}

//ANDREW: This is experimental for the secret reveal effect
var showSecret = function (e){
    var pos = getMousePosition(canvas, e);
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (pos.x < (width / 2) + 100 && pos.x > (width / 2) - 100 && pos.y < (height /2) + 100 && pos.y > (height/2) - 100){
        console.log('secret trigger + 1');
        secretTrigger ++;
    }
    if (secretTrigger > 50){
        window.requestAnimationFrame(drawRainbow);
    }
};

//Draw the initial static texture for the page
drawInitialStatic();

//ANDREW: This is experimental for the secret reveal effect
var secretTrigger = 0;

window.addEventListener('mousemove', refresh, false);
window.addEventListener('mousemove', showSecret, false);
window.addEventListener('resize', drawInitialStatic, false);

