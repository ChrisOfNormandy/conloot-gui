import * as PIXI from 'pixi.js';
import mouse from './common/Mouse';

const loader = PIXI.Loader.shared,
    Graphics = PIXI.Graphics

function decToHex (c) {
    var hex = Number(c).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}


function rgbToHex (r, g, b) {
    return Number(`0x${decToHex(r)}${decToHex(g)}${decToHex(b)}`);
}

const _ = {
    app: null,

    currentColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    },

    resolution: 0,

    background:[],

    width: 0,
    height: 0,
    scale : 0,

    debug : false,
    debugElem : document.getElementById('debug'),
    previewElem: null,

    pixels :[],
    showGrid : false,
    refresh : true,

    doBoundUpdate : true,
    bounds : null,

    type : "WebGL",

    getCurrentColor: () => {
        let rgba = _.currentColor;
        _.previewElem.fillStyle = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
        _.previewElem.fillRect(0, 0, 32, 32);

        return {
            r: _.currentColor.r,
            g: _.currentColor.g,
            b: _.currentColor.b,
            a: _.currentColor.a
        }
    },

    updateBounds: () => {
        let canvasBounds = _.app.view.getBoundingClientRect();

        _.bounds = {
            x: canvasBounds.x,
            y: canvasBounds.y,
            left: canvasBounds.left,
            right: canvasBounds.right,
            top: canvasBounds.top,
            bottom: canvasBounds.bottom,
            width: canvasBounds.width,
            height: canvasBounds.height
        };

        _.doBoundUpdate = false;

        _.refresh = true;
    },

    /**
     * 
     * @param {PIXI.Application} app 
     * @returns {HTMLCanvasElement}
     */
    startup: () => {
        _.onReady(() => _.app.ticker.add(() => _.draw()));

        return _.app.view;
    },

    onReady: (setup) => {
        console.log('App ready. Loading.');

        if (!PIXI.utils.isWebGLSupported()) {
            _.type = "canvas";
        }

        PIXI.utils.sayHello(_.type);

        loader
            .load(setup);
    },

    updateDebug: () => {
        if (_.debugElem === null)
            _.debugElem = document.getElementById('debug');

        if (!_.debug) {
            _.debugElem.innerHTML = "";
            return;
        }

        let mousePos = mouse.getPosition();

        _.debugElem.innerHTML =
            `Mouse: ${JSON.stringify(mousePos)} --> ${Math.floor(mousePos.x / _.resolution)}, ${Math.floor(mousePos.y / _.resolution)}<br />` +
            `Color: ${JSON.stringify(_.currentColor)}<br />` +
            `0x${_.decToHex(_.currentColor.r)}${_.decToHex(_.currentColor.g)}${_.decToHex(_.currentColor.b)}`;
    },

    draw: () => {
        _.updateDebug();

        for (let x = 0; x < _.resolution; x++) {
            for (let y = 0; y < _.resolution; y++) {
                if (_.refresh)
                    _.setPixel(x, y, _.getPixel(x, y).color);

                if (_.getPixel(x, y).update) {
                    _.app.stage.removeChild(_.getPixel(x, y).graphic);

                    if (_.getPixel(x, y).color.a < 255)
                        _.app.stage.addChild(_.background[y * _.resolution + x]);
                    else
                        _.app.stage.removeChild(_.background[y * _.resolution + x]);

                    if (_.getPixel(x, y).color.a > 0)
                        _.app.stage.addChild(_.getPixel(x, y).graphic);

                    _.getPixel(x, y).update = false;
                }
            }
        }

        if (mouse.button.state) {
            let pos = mouse.getPosition();
            let x = Math.floor(pos.x / _.scale),
                y = Math.floor(pos.y / _.scale);

            if (x >= 0 && x < _.resolution && y >= 0 && y < _.resolution) {
                if (mouse.button.id === 0)
                    _.setPixel(x, y, _.getCurrentColor());
                else if (mouse.button.id === 2)
                    _.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0 });

                _.getPixel(x, y).update = true;
            }

            if (!mouse.inBounds)
                mouse.button.state = false;
        }

        _.refresh = false;
    },

    clear: () => {
        for (let x = 0; x < _.resolution; x++) {
            for (let y = 0; y < _.resolution; y++) {
                _.setPixel(x, y, null);
            }
        }
    },

    getPixel: (x, y) => {
        return !_.pixels[x] ? null : !_.pixels[x][y] ? null : _.pixels[x][y];
    },

    setPixel: (x, y, color) => {
        if (!_.getPixel(x, y)) {
            _.pixels[x][y] = {
                color,
                graphic: new Graphics()
            }
        }

        let pixel = _.getPixel(x, y)

        pixel.graphic = new Graphics();

        if (_.showGrid)
            pixel.graphic.lineStyle(1, 0x000000, 1);

        if (color === null)
            pixel.graphic.beginFill(0x000000);
        else
            pixel.graphic.beginFill(rgbToHex(color.r, color.g, color.b));

        pixel.graphic.drawRect(0, 0, _.scale, _.scale);

        pixel.graphic.endFill();

        pixel.graphic.alpha = color === null ? 0 : color.a / 255;

        pixel.graphic.x = x * _.scale;
        pixel.graphic.y = y * _.scale;

        pixel.update = true;

        pixel.color = color === null ? {r: 0, g: 0, b: 0, a: 0} : color;

        return pixel;
    },

    compose: () => {
        const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
        canvas.width = _.resolution;
        canvas.height = _.resolution;

        let imgData = context.createImageData(_.resolution, _.resolution);

        let color;
        for (let x = 0; x < _.resolution; x++) {
            for (let y = 0; y < _.resolution; y++) {
                let v = (y * _.resolution + x) * 4;
                color = _.getPixel(x, y).color;

                imgData.data[v] = color.r;
                imgData.data[v + 1] = color.g;
                imgData.data[v + 2] = color.b;
                imgData.data[v + 3] = color.a;
            }
        }

        context.putImageData(imgData, 0, 0);

        const url = canvas.toDataURL('image/png');
        let link = document.createElement('a');
        link.href = url;
        
        let name = document.getElementById('image_name').value;
        link.setAttribute('download', `${!!name ? name : 'texture'}.png`);
        link.click();
    },

    /**
     * 
     * @param {PIXI.Application} app 
     */
    create: (app, resolution = 16) => {
        _.app = app;

        _.previewElem = document.getElementById('color_picker_display').getContext('2d');
        _.getCurrentColor();

        _.resolution = resolution

        _.width = app.view.width;
        _.height = app.view.height;
        _.scale = _.width / _.resolution;

        _.pixels = [];

        for (let x = 0; x < _.resolution; x++) {
            _.pixels[x] = [];
            for (let y = 0; y < _.resolution; y++) {
                _.background[y * _.resolution + x] = new Graphics();
                _.background[y * _.resolution + x].beginFill(0xFFFFFF);
                _.background[y * _.resolution + x].drawRect(0, 0, _.scale, _.scale);
                _.background[y * _.resolution + x].endFill();
                _.background[y * _.resolution + x].tint = (x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0) ? 0xFFFFFF : 0xDDDDDD;

                _.background[y * _.resolution + x].x = x * _.scale;
                _.background[y * _.resolution + x].y = y * _.scale;

                _.setPixel(x, y, {
                    r: Math.floor(255 * x / (_.resolution - 1)),
                    g: Math.floor(255 * ((x + y) / 2) / (_.resolution - 1)),
                    b: Math.floor(255 * y / (_.resolution - 1)),
                    a: Math.floor(255 - Math.abs(((255 * x / (_.resolution - 1) + 255 * y / (_.resolution - 1)) / 2) - 128))
                });
            }
        }

        return _;
    }
}

const editor = _;

export {
    editor
}