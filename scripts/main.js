var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d"),
imgData = ctx.createImageData(canvas.width, canvas.height);

console.log(canvas.height, canvas.width, 'width and height');
console.log(window.innerWidth, canvas.width);

var drawStatic = function (mousePosition) {

    //console.log(mousePosition.x);
    imgData = ctx.createImageData(50, 50);

    for (i = 0 ; i < imgData.data.length ; i+=4 ){
        var randomColor = Math.floor(Math.random()*256)
        imgData.data[i+0] = randomColor;
        imgData.data[i+1] = randomColor;
        imgData.data[i+2] = randomColor;
        imgData.data[i+3] = 255;
    }

    ctx.putImageData(imgData, mousePosition.x, mousePosition.y);
}

var drawInitialStatic = function(){
    imgData = ctx.createImageData(canvas.width, canvas.height);

    for (i = 0 ; i < imgData.data.length ; i+=4 ){
        var randomColor = Math.floor(Math.random()*256)
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
        drawStatic(pos)
    });
}

drawInitialStatic();
window.addEventListener('mousemove', refresh, false);
window.requestAnimationFrame(drawStatic);