import * as PIXI from 'pixi.js';

import mouse from './common/Mouse';

import Layer from './helpers/Layer';

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
        size: 1,

        mousePos: null,
        cursor: {
            position: {
                x: 0,
                y: 0,
                old: {
                    x: 0,
                    y: 0
                }
            },
            /**
             * @type {PIXI.Graphics}
             */
            graphic: null,
            focus: null,
        },

        getStyle: () => {
            return _.brush.style;
        },
        /**
         * 
         * @param {string} style 
         */
        setStyle: (style) => {
            switch (style) {
                case 'eraser': {
                    _.brush.cursor.graphic.tint = 0xFFFFFF;
                    _.brush.cursor.graphic.alpha = 1;
                    break;
                }
                default: {
                    _.brush.cursor.graphic.tint = colorize.rgbToHex(_.brush.fill.r, _.brush.fill.g, _.brush.fill.b);
                    _.brush.cursor.graphic.alpha = _.brush.fill.a / 255;
                    break;
                }
            }
            _.brush.style = style;
        },

        getColor: () => {
            return {
                r: _.brush.fill.r,
                g: _.brush.fill.g,
                b: _.brush.fill.b,
                a: _.brush.fill.a
            };
        },
        /**
         * 
         * @param {{r: number, g: number, b: number, a: number}} color 
         */
        setColor: (color) => {
            _.brush.cursor.graphic.tint = colorize.rgbToHex(color.r, color.g, color.b);
            _.brush.cursor.graphic.alpha = color.a / 255;

            _.brush.fill = color;
        },

        getSize: () => {
            return _.brush.size;
        },
        setSize: (size) => {
            _.brush.size = size;
        },

        updateCursor: (updateColor = false, updateSize = false) => {
            _.brush.mousePos = mouse.getPosition();

            _.brush.cursor.position.old.x = _.brush.cursor.position.x;
            _.brush.cursor.position.old.y = _.brush.cursor.position.y;

            _.brush.cursor.position.x = Math.floor((_.brush.mousePos.x - (_.brush.size - 1) / 2 * _.scale) / _.scale);
            _.brush.cursor.position.y = Math.floor((_.brush.mousePos.y - (_.brush.size - 1) / 2 * _.scale) / _.scale);

            if (_.brush.cursor.position.old.x !== _.brush.cursor.position.x || _.brush.cursor.position.old.y !== _.brush.cursor.position.y) {
                _.brush.cursor.graphic.x = _.brush.cursor.position.x * _.scale;
                _.brush.cursor.graphic.y = _.brush.cursor.position.y * _.scale;
            }

            if (updateSize) {
                _.brush.cursor.graphic.width = _.scale * _.brush.size;
                _.brush.cursor.graphic.height = _.scale * _.brush.size;
            }

            if (updateColor) {
                _.brush.cursor.graphic.tint = colorize.rgbToHex(_.brush.fill.r, _.brush.fill.g, _.brush.fill.b);
                _.brush.cursor.graphic.alpha = _.brush.fill.a / 255;
            }
        }
    },

    background: [],

    resolution: 0,

    width: 0,
    height: 0,
    scale: 0,

    debug: {
        enabled: true,
        element: document.getElementById('debug')
    },

    pixels: [],
    layers: {
        /**
         * @type {Layer[]}
         */
        cache: [],

        active: 0,

        /**
         * 
         * @param {number} layer 
         * @returns {Layer}
         */
        get: (layer) => {
            return _.layers.cache[layer];
        },
        /**
         * 
         * @returns {Layer}
         */
        getActive: () => {
            return _.layers.cache[_.layers.active];
        },
        add: () => {
            let index = _.layers.cache.length;

            _.layers.cache.push(new Layer(editor));
            _.layers.active = index;
        },
        remove: (index = -1) => {
            _.layers.cache.splice(index, 1);
            _.layers.reload();
            return _.layers;
        },
        move: (index, newIndex) => {
            let layer = _.layers.cache.splice(index, 1)[0];
            _.layers.cache.splice(newIndex, 0, layer);
            _.layers.reload();
        },
        clear: () => {
            _.layers.cache = [];
        },
        toggle: (layer) => {
            _.layers.cache[layer].visable = !_.layers.cache[layer].visable;
            _.layers.reload();
        },
        reload: () => {
            _.refresh = true;
        }
    },
    buffer: [],

    showGrid: false,
    refresh: false,

    doBoundUpdate: true,
    bounds: null,

    updateBounds: () => {
        _.bounds = _.app.view.getBoundingClientRect();
        _.doBoundUpdate = false;
    },

    startup: () => {
        _.onReady(() => _.app.ticker.add(() => _.draw()));
        return _.app.view;
    },

    onReady: (setup) => {
        console.log('App ready. Loading.');

        loader
            .load(setup);
    },

    clear: () => {
        _.layers.cache.forEach(layer => layer.clear());
        _.refresh = true;
    },

    updateDebug: () => {
        let pos = mouse.getPosition();
        let x = Math.floor(pos.x / _.scale),
            y = Math.floor(pos.y / _.scale);
        let pixel = _.pixels[y * _.resolution + x];

        if (!pixel)
            return;

        _.debug.element.innerHTML =
            `Mouse: ${JSON.stringify(pos)} --> ${x}, ${y}<br />` +
            `Brush:<br />` +
            ` - Color: ${JSON.stringify(_.brush.fill)}<br />` +
            ` - Pos: ${_.brush.cursor.position.x}, ${_.brush.cursor.position.y} --> ${_.brush.cursor.position.x + _.brush.size - 1}, ${_.brush.cursor.position.y + _.brush.size - 1}<br />` +
            ` - Hex: 0x${colorize.decToHex(_.brush.fill.r)}${colorize.decToHex(_.brush.fill.g)}${colorize.decToHex(_.brush.fill.b)}<br />` +
            ` - Style: ${_.brush.style}<br />` +
            `Buffer: ${_.buffer.length}<br />` +
            `Hover: ${JSON.stringify(pixel.color)}<br />` +
            ` - Tint:${pixel.graphic.tint}<br />` +
            ` - Alpha: ${pixel.graphic.alpha}`;
    },

    updatePixel: (x, y) => {
        if (!_.pixels[y * _.resolution + x])
            _.setPixel(x, y);

        let color = null;

        _.layers.cache.forEach(layer => {
            if (!layer.visable)
                return;

            let col = layer.getPixel(x, y).color;
            if (col.a === 0)
                return;

            if (color === null) {
                color = col;
            }
            else
                color = colorize.calculatePixelColor(col, color);
        });
        
        _.pixels[y * _.resolution + x].color = color || { r: 0, g: 0, b: 0, a: 0 };
        _.pixels[y * _.resolution + x].graphic.tint = colorize.rgbColorToHex(_.pixels[y * _.resolution + x].color);
        _.pixels[y * _.resolution + x].graphic.alpha = _.pixels[y * _.resolution + x].color.a / 255;
    },

    draw: () => {
        if (_.debug.element === null) {
            _.debug.element = document.getElementById('debug');
            return;
        }

        if (_.debug.enabled) {
            if (_.debug.element.classList.contains('hidden'))
                _.debug.element.classList.remove('hidden');
            _.updateDebug();
        }
        else if (!_.debug.element.classList.contains('hidden'))
            _.debug.element.classList.add('hidden')

        if (_.refresh) {
            _.pixels.forEach(pixel => {
                _.updatePixel(pixel.x, pixel.y);

                _.app.stage.removeChild(pixel.graphic);
                _.app.stage.addChild(pixel.graphic);
            });

            _.app.stage.removeChild(_.brush.cursor.graphic);
            _.app.stage.addChild(_.brush.cursor.graphic);

            _.refresh = false;

            return;
        }

        _.buffer.forEach((pixel, i) => {
            _.updatePixel(pixel.x, pixel.y);

            if (pixel.changed) {
                if (!mouse.button.state)
                    pixel.changed = false;
            }
            else
                _.buffer.splice(i, 1);
        });

        _.brush.updateCursor();

        let layer = _.layers.getActive();
        let buf;

        let color, ignoreChange, alpha;

        if (!!layer) {
            if (mouse.button.state) {
                if (mouse.button.id === 0) {
                    for (let x = _.brush.cursor.position.x < 0 ? 0 : _.brush.cursor.position.x; x < _.brush.cursor.position.x + _.brush.size && x < _.resolution; x++) {
                        for (let y = _.brush.cursor.position.y < 0 ? 0 : _.brush.cursor.position.y; y < _.brush.cursor.position.y + _.brush.size && y < _.resolution; y++) {
                            switch (_.brush.style) {
                                case 'paint': {
                                    color = _.brush.getColor();

                                    color.a = (_.brush.fill.a / 255) * Math.floor((1 - (distance.manhattan(
                                        {
                                            x: _.brush.cursor.position.x + Math.floor(_.brush.size / 2),
                                            y: _.brush.cursor.position.y + Math.floor(_.brush.size / 2)
                                        },
                                        {
                                            x, y
                                        }
                                    ) / Math.round(_.brush.size / 2))) * 255);
                                    if (color.a < 0)
                                        color.a = 0;

                                    ignoreChange = _.brush.cursor.position.old.x !== _.brush.cursor.position.x || _.brush.cursor.position.old.y !== _.brush.cursor.position.y;
                                    alpha = null;
                                    break;
                                }
                                case 'eraser': {
                                    color = null;
                                    ignoreChange = _.brush.cursor.position.old.x !== _.brush.cursor.position.x || _.brush.cursor.position.old.y !== _.brush.cursor.position.y;
                                    alpha = 0;
                                    break
                                }
                                default: {
                                    color = _.brush.getColor();
                                    ignoreChange = false;
                                    alpha = null;
                                    break;
                                }
                            }

                            buf = layer.updatePixel(x, y, color, ignoreChange, alpha);
                            
                            if (buf !== null)
                                _.buffer.push(buf);
                        }
                    }
                }
            }
        }

        if (!mouse.inBounds)
            mouse.button.state = false;

        mouse.clicked = false;
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

    setPixel: (x, y, color = null) => {
        _.pixels[y * _.resolution + x] = {
            graphic: new Graphics(),
            color: color === null ? {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            } : color,
            changed: false,
            x,
            y
        };

        _.pixels[y * _.resolution + x].graphic.beginFill(0xFFFFFF);
        _.pixels[y * _.resolution + x].graphic.drawRect(0, 0, _.scale, _.scale);
        _.pixels[y * _.resolution + x].graphic.endFill();

        _.pixels[y * _.resolution + x].graphic.tint = colorize.rgbColorToHex(_.pixels[y * _.resolution + x].color);
        _.pixels[y * _.resolution + x].graphic.alpha = _.pixels[y * _.resolution + x].color.a / 255;

        _.pixels[y * _.resolution + x].graphic.x = x * _.scale;
        _.pixels[y * _.resolution + x].graphic.y = y * _.scale;

        return _.pixels[y * _.resolution + x];
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

        _.resolution = resolution

        _.width = app.view.width;
        _.height = app.view.height;
        _.scale = _.width / _.resolution;

        _.pixels = [];

        _.layers.clear();
        _.layers.add();

        _.brush.cursor.graphic = new Graphics();
        _.brush.cursor.graphic.beginFill(0xFFFFFF);
        _.brush.cursor.graphic.drawRect(-1, -1, _.scale + 3, _.scale + 3);
        _.brush.cursor.graphic.endFill();

        _.brush.updateCursor(true, true);

        let layer = _.layers.get(_.layers.active);

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

                _.app.stage.addChild(_.setPixel(x, y).graphic);

                layer.setPixel(x, y, _.pixels[y * _.resolution + x].color);
            }
        }

        _.app.stage.addChild(_.brush.cursor.graphic);

        return _;
    }
}

const editor = _;

export {
    editor
}