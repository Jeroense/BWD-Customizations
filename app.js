var canvasWidth = 580;
var canvasHeight = 646;

function drawImage(tshirtObj) {
    var stage = new Konva.Stage({
    container: "container",
    width: canvasWidth,
    height: canvasHeight
    });

    // Create single layer for both images
    var layer = new Konva.Layer();

    var tShirtImage = new Konva.Image({
        image: tshirtObj,
        width: 580,
        height: 646,
        draggable: false
    });

    var printImage = new Konva.Image({
        image: printObj,
        width: 200,
        height: 139,
        x: 190,
        y: 169,
        draggable: true
    });

    // add cursor styling
    printImage.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    });
    printImage.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });

    printImage.on('dragmove', function() {
        update(this);
        layer.draw();
    });

    // Show Images
    layer.add(tShirtImage);
    layer.add(printImage);
    stage.add(layer);
}

// Create images
var tshirtObj = new Image();
tshirtObj.src = 'images/tshirt-white.png';
tshirtObj.onload = function() {
    drawImage(this);
};

var printObj = new Image();
printObj.src = 'images/print.png';
printObj.onload = function() {
    drawImage(this);
};
