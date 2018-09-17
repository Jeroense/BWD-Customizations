var canvasWidth = 580;
var canvasHeight = 646;

function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if(width && height) {
        image.width(width);
        image.height(height);
    }
}

function addAnchor(group, x, y, position) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#333',
        fill: '#eee',
        strokeWidth: 2,
        radius: 5,
        name: position,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
}

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
    });

    var printGroup = new Konva.Group({
        x: 190,  // !!! manually set for center of base image. (needs to be calculated) 
        y: 169,  // !!! manually set for 1 third from top of base image. (needs to be calculated)
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
    layer.add(printGroup);
    printGroup.add(printImage);
    addAnchor(printGroup, 0, 0, 'topLeft');
    addAnchor(printGroup, 200, 0, 'topRight');
    addAnchor(printGroup, 200, 139, 'bottomRight');
    addAnchor(printGroup, 0, 139, 'bottomLeft');
    stage.add(layer);
}

// Create images
var tshirtObj = new Image();
tshirtObj.src = 'images/tshirt-white.png';
tshirtObj.onload = function() {
    drawImage(this);
};

var printObj = new Image();
printObj.src = 'images/print1.jpg';
printObj.onload = function() {
    drawImage(this);
};
