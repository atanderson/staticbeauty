//Main javascript

var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var canvasHeight = canvas.height,
    canvasWidth = canvas.width,
    ctx = canvas.getContext("2d"),
    imgData = ctx.createImageData(canvasHeight, canvasWidth);
console.log(window.innerWidth);

var drawStatic = function (mousePosition) {

    //console.log(mousePosition.x);


    var rowSize = canvasWidth * 4,
        mouseCenter = (mousePosition.x + mousePosition.y * canvasWidth) * 4,
        boxSize = 20,
        boxHeightStart = mouseCenter - rowSize * boxSize,
        boxHeightEnd = mouseCenter + rowSize * boxSize,
        boxWidthStart = (mousePosition.x - boxSize)*4,
        boxWidthEnd = (mousePosition.x + boxSize)*4,
        max = Math.min(imgData.data.length, mouseCenter);

    for (var yOffset = boxHeightStart; yOffset < boxHeightEnd; yOffset += rowSize) {
        for (var xOffset = boxWidthStart; xOffset < boxWidthEnd; xOffset += 4) {
            var px = 4,
                offset = yOffset + xOffset,
                randomColor = Math.floor(Math.random() * 256);
            while (--px) {
                imgData.data[offset + px] = randomColor
            }
        }
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

window.addEventListener('mousemove', refresh, false);
window.requestAnimationFrame(drawStatic);