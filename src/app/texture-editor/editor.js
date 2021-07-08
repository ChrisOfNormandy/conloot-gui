import * as PIXI from 'pixi.js';
import mouse from './common/Mouse';

import * as colorize from './helpers/colorize';
import * as distance from './helpers/distance';

const loader = PIXI.Loader.shared,
    Graphics = PIXI.Graphics


const _ = {
    /**
     * @type {PIXI.Application}
     */
    app: null,

    brush: {
        style: 'pencil',
        fill: {
            r: 0, g: 0, b: 0, a: 255
        },
        size: 1
    },

    resolution: 0,

    background: [],

    width: 0,
    height: 0,
    scale: 0,

    debug: false,
    debugElem: document.getElementById('debug'),

    pixels: [],
    showGrid: false,
    refresh: false,

    doBoundUpdate: true,
    bounds: null,

    type: "WebGL",

    getCurrentColor: () => {
        return {
            r: _.brush.fill.r,
            g: _.brush.fill.g,
            b: _.brush.fill.b,
            a: _.brush.fill.a
        }
    },

    setBrush: (brush) => {
        switch (brush) {
            case 'eraser': {
                _.painting.highlight.graphic.tint = 0xFFFFFF;
                _.painting.highlight.graphic.alpha = 1;
                break;
            }
            default: {
                _.painting.highlight.graphic.tint = colorize.rgbToHex(_.brush.fill.r, _.brush.fill.g, _.brush.fill.b);
                _.painting.highlight.graphic.alpha = _.brush.fill.a / 255;
                break;
            }
        }
        _.brush.style = brush;
    },

    setBrushSize: (size) => {
        _.brush.size = size;
    },

    setBrushFill: (color) => {
        _.brush.fill = color;
        _.painting.highlight.graphic.tint = colorize.rgbToHex(color.r, color.g, color.b);
        _.painting.highlight.graphic.alpha = color.a / 255;
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

        let pos = mouse.getPosition();
        let x = Math.floor(pos.x / _.scale),
            y = Math.floor(pos.y / _.scale);
        let pixel = _.getPixel(x, y);

        if (pixel === null)
            return;

        _.debugElem.innerHTML =
            `Mouse: ${JSON.stringify(pos)} --> ${x}, ${y}<br />` +
            `Brush:<br />` +
            ` - Color: ${JSON.stringify(_.brush.fill)}<br />` +
            ` - Pos: ${_.painting.highlight.x}, ${_.painting.highlight.y} --> ${_.painting.highlight.x + _.brush.size - 1}, ${_.painting.highlight.y + _.brush.size - 1}<br />` +
            ` - Hex: 0x${colorize.decToHex(_.brush.fill.r)}${colorize.decToHex(_.brush.fill.g)}${colorize.decToHex(_.brush.fill.b)}<br />` +
            ` - Style: ${_.brush.style}<br />` +
            `Buffer: ${_.buffer.length}<br />` +
            `Hover: ${JSON.stringify(pixel.color)}<br />` +
            ` - Tint:${pixel.graphic.tint}<br />` +
            ` - Alpha: ${pixel.graphic.alpha}`;
    },

    buffer: [],

    painting: {
        mousePos: null,
        highlight: {
            x: 0, y: 0, graphic: null, focus: null
        },
        old: {
            x: 0,
            y: 0
        }
    },

    draw: () => {
        _.updateDebug();

        if (_.refresh) {
            _.pixels.forEach(pixel => {
                _.app.stage.removeChild(pixel.graphic);
                _.setPixel(pixel.x, pixel.y, pixel.color);
            });
            _.refresh = false;

            _.app.stage.removeChild(_.painting.highlight.graphic);
            _.app.stage.addChild(_.painting.highlight.graphic);
            return;
        }

        _.buffer.forEach((pixel, i) => {
            pixel.graphic.tint = colorize.rgbToHex(pixel.color.r, pixel.color.g, pixel.color.b);
            pixel.graphic.alpha = pixel.color.a / 255;

            if (pixel.changed) {
                if (!mouse.button.state)
                    pixel.changed = false;
            }
            else
                _.buffer.splice(i, 1);
        });

        _.painting.mousePos = mouse.getPosition();

        _.painting.old.x = _.painting.highlight.x;
        _.painting.old.y = _.painting.highlight.y;

        _.painting.highlight.x = Math.floor((_.painting.mousePos.x - (_.brush.size - 1) / 2 * _.scale) / _.scale);
        _.painting.highlight.y = Math.floor((_.painting.mousePos.y - (_.brush.size - 1) / 2 * _.scale) / _.scale);

        _.painting.highlight.graphic.x = _.painting.highlight.x * _.scale;
        _.painting.highlight.graphic.y = _.painting.highlight.y * _.scale;

        _.painting.highlight.graphic.width = _.scale * _.brush.size;
        _.painting.highlight.graphic.height = _.scale * _.brush.size;

        if (mouse.button.state) {
            if (mouse.button.id === 0) {
                for (let x = _.painting.highlight.x < 0 ? 0 : _.painting.highlight.x; x < _.painting.highlight.x + _.brush.size && x < _.resolution; x++) {
                    for (let y = _.painting.highlight.y < 0 ? 0 : _.painting.highlight.y; y < _.painting.highlight.y + _.brush.size && y < _.resolution; y++) {
                        switch (_.brush.style) {
                            case 'paint': {
                                let color = _.getCurrentColor();
                                color.a = (_.brush.fill.a / 255) * Math.floor((1 - (distance.manhattan(
                                    {
                                        x: _.painting.highlight.x + Math.floor(_.brush.size / 2),
                                        y: _.painting.highlight.y + Math.floor(_.brush.size / 2)
                                    },
                                    {
                                        x, y
                                    }
                                ) / Math.round(_.brush.size / 2))) * 255);
                                if (color.a < 0)
                                    color.a = 0;

                                _.updatePixel(x, y, color, _.painting.old.x !== _.painting.highlight.x || _.painting.old.y !== _.painting.highlight.y);
                                break;
                            }
                            case 'eraser': {
                                _.updatePixel(x, y, null, _.painting.old.x !== _.painting.highlight.x || _.painting.old.y !== _.painting.highlight.y, 0);
                                break
                            }
                            default: {
                                _.updatePixel(x, y, _.getCurrentColor());
                                break;
                            }
                        }
                    }
                }
            }

            if (!mouse.inBounds)
                mouse.button.state = false;
        }

        mouse.clicked = false;
    },

    clear: () => {
        _.pixels.forEach(pixel => {
            pixel.color = { r: 0, g: 0, b: 0, a: 0 };
            pixel.graphic.tint = 0x000000;
            pixel.graphic.alpha = 0;
        });
    },

    getPixel: (x, y) => {
        return !_.pixels[y * _.resolution + x] ? null : _.pixels[y * _.resolution + x];
    },

    updatePixel: (x, y, color, ignoreChange = false, alpha = null) => {
        let pixel = _.getPixel(x, y);
        if (pixel === null || (pixel.changed && !ignoreChange))
            return;

        if (alpha === null) {
            pixel.color = color === null ? {r: 0, g: 0, b: 0, a: 0} : colorize.calculatePixelColor(pixel.color, color);
            pixel.changed = true;
        }
        else
            pixel.color.a = (pixel.color.a / 255) * alpha;

        _.buffer.push(pixel);
    },

    setPixel: (x, y, color) => {
        if (!_.getPixel(x, y)) {
            _.pixels[y * _.resolution + x] = {
                color,
                graphic: null,
                x,
                y,
                index: y * _.resolution + x,
                changed: false
            }
        }

        let pixel = _.getPixel(x, y);

        pixel.graphic = new Graphics();

        if (_.showGrid)
            pixel.graphic.lineStyle(1, 0x000000, 1);

        pixel.graphic.beginFill(0xFFFFFF);
        pixel.graphic.drawRect(0, 0, _.scale, _.scale);
        pixel.graphic.endFill();

        pixel.graphic.tint = colorize.rgbToHex(color.r, color.g, color.b);
        pixel.graphic.alpha = color.a / 255;

        pixel.graphic.x = x * _.scale;
        pixel.graphic.y = y * _.scale;

        pixel.color = color === null ? { r: 0, g: 0, b: 0, a: 0 } : color;

        _.app.stage.addChild(pixel.graphic);

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
        if (_.app !== null)
            while (_.app.stage.children[0])
                _.app.stage.removeChild(_.app.stage.children[0]);

        _.app = app;

        _.getCurrentColor();

        _.resolution = resolution

        _.width = app.view.width;
        _.height = app.view.height;
        _.scale = _.width / _.resolution;

        _.pixels = [];

        _.painting.highlight.graphic = new Graphics();
        _.painting.highlight.graphic.beginFill(0xFFFFFF);
        _.painting.highlight.graphic.drawRect(0, 0, _.scale + 3, _.scale + 3);
        _.painting.highlight.graphic.endFill();

        _.painting.highlight.graphic.tint = colorize.rgbToHex(_.brush.fill.r, _.brush.fill.g, _.brush.fill.b);
        _.painting.highlight.graphic.alpha = _.brush.fill.a / 255;

        for (let x = 0; x < _.resolution; x++) {
            for (let y = 0; y < _.resolution; y++) {
                _.background[y * _.resolution + x] = new Graphics();
                _.background[y * _.resolution + x].beginFill(0xFFFFFF);
                _.background[y * _.resolution + x].drawRect(0, 0, _.scale, _.scale);
                _.background[y * _.resolution + x].endFill();
                _.background[y * _.resolution + x].tint = (x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0) ? 0xFFFFFF : 0xDDDDDD;

                _.background[y * _.resolution + x].x = x * _.scale;
                _.background[y * _.resolution + x].y = y * _.scale;

                _.app.stage.addChild(_.background[y * _.resolution + x]);

                _.setPixel(x, y, {
                    r: Math.floor(255 * x / (_.resolution - 1)),
                    g: Math.floor(255 * ((x + y) / 2) / (_.resolution - 1)),
                    b: Math.floor(255 * y / (_.resolution - 1)),
                    a: Math.floor(255 - Math.abs(((255 * x / (_.resolution - 1) + 255 * y / (_.resolution - 1)) / 2) - 128))
                });
            }
        }

        _.app.stage.addChild(_.painting.highlight.graphic);

        return _;
    }
}

const editor = _;

export {
    editor
}