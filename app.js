var baseHeight = 0;
var baseWidth = 0;
var customHeight = 0;
var customWidth = 0;
var ratio = 1;
var fixedRatio = true;
var stage;
var posX;
var posY;

var scalingText = document.querySelector("#ratioText");
document.querySelector('#ratio').addEventListener('click', function(){
    fixedRatio = !fixedRatio;
    if(fixedRatio === true) {
        scalingText.innerHTML = "Fixed Ratio";
    } else {
        scalingText.innerHTML = "Free Form";
    }
    drawImage();
});

function getPrintPosition(group) {
    posX = group.attrs.x;
    posY = group.attrs.y;
    var lines = stage.find('#topLine')[0];
    if(((posX - (parseInt(Math.abs(customWidth)) / 2))) == (baseWidth / 2)) {
        lines.attrs.stroke = 'blue';
    } else {
        lines.attrs.stroke = 'red';
    }
}

function update(activeAnchor) {
    var group = activeAnchor.getParent();
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var top = group.get('.top')[0];
    var right = group.get('.right')[0];
    var bottom = group.get('.bottom')[0];
    var left = group.get('.left')[0];
    var image = group.get('Image')[0];
    var origin = group.get('.origin')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    if(fixedRatio !== true) {
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
    } else {
        switch (activeAnchor.getName()) {
            case 'top':
                top.setX(customWidth / 2);
                right.setX((-anchorY * ratio) + customWidth);
                right.setY(customHeight / 2);
                left.setX(anchorY * ratio);
                left.setY(customHeight / 2);
                bottom.setY(customHeight - anchorY);
                origin.setX(anchorY * ratio);
                origin.setY(anchorY);
            break;
            case 'right':
                right.setY(customHeight / 2);
                left.setX(customWidth - anchorX);
                top.setY(customHeight - (anchorX / ratio));
                top.setX(customWidth / 2);
                bottom.setX(customWidth / 2);
                bottom.setY(anchorX / ratio);
                origin.setX(customWidth - anchorX);
                origin.setY(customHeight - (anchorX / ratio));
            break;
            case 'bottom':
                top.setY(customHeight - anchorY);
                bottom.setX(customWidth/2);
                right.setY(customHeight / 2);
                right.setX((-anchorY * ratio) + customWidth);
                left.setY(customHeight / 2);
                left.setX(anchorY * ratio);
                origin.setX(anchorY * ratio);
                origin.setY(customHeight - anchorY);
            break;
            case 'left':
                left.setY(customHeight / 2);
                right.setX(-anchorX + customWidth);
                top.setY(customHeight - (anchorX / ratio));
                top.setX(customWidth / 2);
                bottom.setX(customWidth / 2);
                bottom.setY(anchorX / ratio);
                origin.setX(anchorX);
                origin.setY(customHeight - (anchorX / ratio));
            break;
        }
        image.position(origin.position());

        var width = right.getX() - left.getX();
        var height = bottom.getY() - top.getY();
        
        if(width && height) {
            image.width(width);
            image.height(height);
        }
    }
}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#333',
        fill: '#eee',
        strokeWidth: 2,
        radius: 5,
        name: name,
        draggable: true,
        dragOnTop: false,
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
        this.setStrokeWidth(3);
        this.stroke('red');
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        this.stroke('#333');
        layer.draw();
    });

    group.add(anchor);
}

// Create an invisible help anchor when in 'Fixed Ratio' mode.
// Position: rightBottom
function addOrigin(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 0,
        name: name,
        draggable: false,
        dragOnTop: false,
    });
    group.add(anchor);
}

function addLines(group, x, y, name) {
    // var layer = group.getLayer();
    var helpLine = new Konva.Line({
        x: x,
        y: y,
        points: [0, baseHeight, 0, 0],
        name: name,
        stroke: 'blue',
        dash: [1,3],
        strokeWidth: 1,
        tension: 1,
        id: name
    });
    // layer.Draw();
    group.add(helpLine);
}

function drawImage() {
    stage = new Konva.Stage({
    container: "container",
    width: baseWidth,
    height: baseHeight
    });

    // Create single layer for both images
    var layer = new Konva.Layer();

    var tShirtImage = new Konva.Image({
        image: tshirtObj,
        width: baseWidth,
        height: baseHeight,
    });

    var printImage = new Konva.Image({
        image: printObj,
        width: customWidth,
        height: customHeight,
    });

    var printGroup = new Konva.Group({
        x: (baseWidth - customWidth) / 2,  // center hoizontally
        y: (baseHeight - customHeight) / 3,  // position at 1/3 from top
        draggable: true
    });

    var baseGroup = new Konva.Group({
        x: 0,  
        y: 0,  
        draggable: false
    });

    // add cursor styling
    printImage.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    });
    printImage.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });

    printGroup.on('dragmove', function() {
        getPrintPosition(this);
    });

    // Show Images
    layer.add(baseGroup)
    baseGroup.add(tShirtImage);
    layer.add(printGroup);
    printGroup.add(printImage);
    if(fixedRatio !== true){
        addAnchor(printGroup, customWidth, customHeight, 'topLeft');
        addAnchor(printGroup, 0, customHeight, 'topRight');
        addAnchor(printGroup, 0, 0, 'bottomRight');
        addAnchor(printGroup, customWidth, 0, 'bottomLeft');
    } else {
        addAnchor(printGroup, customWidth / 2, customHeight, 'top');
        addAnchor(printGroup, 0, customHeight / 2, 'right');
        addAnchor(printGroup, customWidth / 2, 0, 'bottom');
        addAnchor(printGroup, customWidth, customHeight / 2, 'left');
        addOrigin(printGroup, customWidth, customHeight, 'origin');
    }
    addLines(baseGroup, (baseWidth / 2), 0, 'topLine');
    stage.add(layer);
}

// Create images
var tshirtObj = new Image();
tshirtObj.src = 'images/tshirt-white.png';
tshirtObj.onload = function() {
    baseHeight = this.height;
    baseWidth = this.width;
    drawImage(this);
};

var printObj = new Image();
printObj.src = 'images/print.png';
printObj.onload = function() {
    ratio = this.width / this.height
    customHeight = this.height;
    customWidth = customHeight * ratio;
    if (customWidth > (baseWidth - 50)) {
        var scale = customWidth / (baseWidth - 200);
        customWidth = printObj.width / scale;
        customHeight = printObj.height / scale;
    }
    drawImage(this);
};
