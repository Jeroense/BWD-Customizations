var baseWidth = 0;
var baseHeight = 0;
var customWidth = 0;
var customHeight = 0;
var stage;

function drawImage() {
    stage = new Konva.Stage({
        container: 'container',
        width: baseWidth,
        height: baseHeight
    });

    var layer = new Konva.Layer();

    var baseImage = new Konva.Image({
        image: baseObj,
        width: baseWidth,
        height: baseHeight,
        draggable: false,
        
    });
    layer.add(baseImage);

    var customImage = new Konva.Image({
        image: customObj,
        width: customWidth,
        height: customHeight,

        x: (baseWidth - customWidth) / 2,
        y: (baseHeight - customHeight) / 3,
        name: 'customization',
        draggable: true,
        visible: true
    });
    layer.add(customImage);

    stage.add(layer);

    stage.on('click tap', function (e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
            stage.find('Transformer').destroy();
            layer.draw();
            return;
        }
        // do nothing if clicked outside of customImage
        if (!e.target.hasName('customization')) {
            return;
        }

        var tr = new Konva.Transformer({
            centeredScaling: true,
            rotateEnabled: true,
            anchorStroke: "red",
            rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315, 360]
        });
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
    });

}

var baseObj = new Image();
baseObj.src = 'images/tshirt-white.png';
baseObj.onload = function() {
    drawImage(this);
};

var customObj = new Image();
customObj.src = 'images/lips.png';
customObj.onload = function() {
    ratio = this.width / this.height
    customHeight = this.height;
    customWidth = customHeight * ratio;
    baseHeight = baseObj.height;
    baseWidth = baseObj.width;
    if (customWidth > (baseWidth * .75)) {
        var scale = customWidth / (baseWidth * .6);
        customWidth = customObj.width / scale;
        customHeight = customObj.height / scale;
    }
    drawImage(this);
};
