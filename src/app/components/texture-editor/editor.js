import { Loader, Graphics, Container } from 'pixi.js';

import Mouse from './common/Mouse';

import Layer from './helpers/Layer';

import * as colorize from './helpers/colorize';
import * as distance from './helpers/distance';

const loader = Loader.shared;

export default class Editor {
    /**
     *
     * @returns {HTMLCanvasElement}
     */
    startup() {
        this.onReady(() => this.app.ticker.add(() => this.draw()));

        return this.app.view;
    }

    /**
     *
     * @param {()} setup
     */
    onReady(setup) {
        console.log('App ready. Loading.');

        loader
            .load(setup);
    }

    checkColor(color1, color2, tollerance = 5) {
        return (
            Math.abs(color1.r - color2.r) <= tollerance &&
            Math.abs(color1.g - color2.g) <= tollerance &&
            Math.abs(color1.b - color2.b) <= tollerance &&
            Math.abs(color1.a - color2.a) <= tollerance
        );
    }

    fill(filled, color, pos, origin, alpha = 1, ignoreChange = false) {
        let pixel = this.layer.getPixel(pos.x, pos.y);

        if (pixel === null || !this.checkColor(pixel.color, origin.color) || pos.x < 0 || pos.y >= this.resolution || pos.y < 0 || pos.y >= this.resolution)
            return;

        let buf = filled.includes(pos)
            ? null
            : this.layer.updatePixel(pos.x, pos.y, color, ignoreChange, alpha);

        if (buf !== null) {
            this.image.buffer.push(buf);
            filled.push(pos);

            buf = this.fill(filled, color, { x: pos.x - 1, y: pos.y }, origin, alpha, ignoreChange);
            buf = this.fill(filled, color, { x: pos.x + 1, y: pos.y }, origin, alpha, ignoreChange);
            buf = this.fill(filled, color, { x: pos.x, y: pos.y - 1 }, origin, alpha, ignoreChange);
            buf = this.fill(filled, color, { x: pos.x, y: pos.y + 1 }, origin, alpha, ignoreChange);
        }

        return buf;
    }

    /**
     *
     * @returns
     */
    draw() {
        if (this.debug.element === null) {
            this.debug.element = document.getElementById('debug');

            return;
        }

        if (this.debug.enabled) {
            if (this.debug.element.classList.contains('hidden'))
                this.debug.element.classList.remove('hidden');

            this.debug.update();
        }
        else if (!this.debug.element.classList.contains('hidden'))
            this.debug.element.classList.add('hidden');

        if (this.refresh) {
            this.image.pixels.forEach((pixel) => {
                this.image.updatePixel(pixel.x, pixel.y);

                this.app.stage.removeChild(pixel.graphic);
                this.app.stage.addChild(pixel.graphic);
            });

            this.app.stage.removeChild(this.brush.cursor.graphic);
            this.app.stage.addChild(this.brush.cursor.graphic);

            if (this.grid.enabled)
                this.grid.show();

            this.refresh = false;

            return;
        }

        this.image.buffer.forEach((pixel, i) => {
            this.image.updatePixel(pixel.x, pixel.y);

            if (pixel.changed) {
                if (!Mouse.button.state)
                    pixel.changed = false;
            }
            else
                this.image.buffer.splice(i, 1);
        });

        this.brush.updateCursor();

        let layer = this.layers.getActive();
        let buf;

        let color, ignoreChange, alpha;

        if (layer) {
            if (Mouse.clicked) {
                switch (this.brush.style) {
                    case 'fill': {
                        let position = {
                            x: this.brush.cursor.position.x,
                            y: this.brush.cursor.position.y
                        };

                        let origin = {
                            color: layer.getPixel(position.x, position.y).color
                        };

                        color = this.brush.getColor();
                        ignoreChange = false;
                        alpha = 1;

                        let filled = [];

                        buf = this.fill(filled, color, position, origin, alpha, ignoreChange);
                        break;
                    }
                    case 'color-picker': {
                        let color = layer.getPixel(this.brush.cursor.position.x, this.brush.cursor.position.y).color;

                        this.brush.setColor(color);
                        this.brush.preview.update();
                        this.brush.updateCursor(true);

                        break;
                    }
                    default: { break; }
                }
            }
            else if (Mouse.button.state) {
                if (Mouse.button.id === 0) {
                    switch (this.brush.style) {
                        case 'color-picker': { break; }
                        default: {
                            for (let x = this.brush.cursor.position.x < 0
                                ? 0
                                : this.brush.cursor.position.x; x < this.brush.cursor.position.x + this.brush.size && x < this.resolution; x++) {
                                for (let y = this.brush.cursor.position.y < 0
                                    ? 0
                                    : this.brush.cursor.position.y; y < this.brush.cursor.position.y + this.brush.size && y < this.resolution; y++) {
                                    switch (this.brush.style) {
                                        case 'paint': {
                                            color = this.brush.getColor();

                                            color.a = (this.brush.fill.a / 255) * Math.floor((1 - (distance.manhattan(
                                                {
                                                    x: this.brush.cursor.position.x + Math.floor(this.brush.size / 2),
                                                    y: this.brush.cursor.position.y + Math.floor(this.brush.size / 2)
                                                },
                                                {
                                                    x, y
                                                }
                                            ) / Math.round(this.brush.size / 2))) * 255);

                                            if (color.a < 0)
                                                color.a = 0;

                                            ignoreChange = this.brush.cursor.position.old.x !== this.brush.cursor.position.x || this.brush.cursor.position.old.y !== this.brush.cursor.position.y;
                                            alpha = null;

                                            break;
                                        }
                                        case 'eraser': {
                                            color = null;
                                            ignoreChange = this.brush.cursor.position.old.x !== this.brush.cursor.position.x || this.brush.cursor.position.old.y !== this.brush.cursor.position.y;
                                            alpha = 0;

                                            break;
                                        }
                                        default: {
                                            color = this.brush.getColor();
                                            ignoreChange = false;
                                            alpha = null;

                                            break;
                                        }
                                    }

                                    buf = layer.updatePixel(x, y, color, ignoreChange, alpha);

                                    if (buf !== null)
                                        this.image.buffer.push(buf);
                                }
                            }

                            break;
                        }
                    }
                }
            }
        }

        if (!Mouse.inBounds)
            Mouse.button.state = false;

        Mouse.clicked = false;
    }

    /**
     *
     * @param {boolean} amount
     */
    zoom(amount) {
        if ((amount && this.zoomSettings.scale <= -9) || (!amount && this.zoomSettings.scale >= 20))
            return;

        this.zoomSettings.scale += amount
            ? -1
            : 1;

        this.zoomSettings.value = this.zoomSettings.scale < 0
            ? (10 + this.zoomSettings.scale) / 10
            : 1 + this.zoomSettings.scale / 10;

        this.zoomSettings.width = (this.app.view.width < this.app.view.height
            ? this.app.view.width
            : this.app.view.height) * this.zoomSettings.value;
        this.zoomSettings.height = this.zoomSettings.width;
        this.zoomSettings.offset.x = (this.app.view.width - this.zoomSettings.width) / 2;
        this.zoomSettings.offset.y = (this.app.view.height - this.zoomSettings.height) / 2;

        for (let g in this.display) {
            this.display[g].width = this.zoomSettings.width;
            this.display[g].height = this.zoomSettings.height;
            this.display[g].x = this.zoomSettings.offset.x;
            this.display[g].y = this.zoomSettings.offset.y;
        }

        this.scale = (this.display.imageGroup.width < this.display.imageGroup.height
            ? this.display.imageGroup.width
            : this.display.imageGroup.height) / this.resolution;

        this.scale *= this.zoomSettings.value;

        this.brush.updateCursor(false, true);
    }

    /**
     *
     * @returns .
     */
    create() {
        if (this.app !== null)
            while (this.app.stage.children[0])
                this.app.stage.removeChild(this.app.stage.children[0]);

        let layer = this.layers.get(this.layers.active);

        let bgPixel;
        for (let x = 0; x < this.resolution; x++) {
            for (let y = 0; y < this.resolution; y++) {
                bgPixel = new Graphics();
                bgPixel.beginFill(0xFFFFFF);
                bgPixel.drawRect(0, 0, this.scale, this.scale);
                bgPixel.endFill();

                bgPixel.tint = (x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0)
                    ? 0xFFFFFF
                    : 0xDDDDDD;

                bgPixel.x = x * this.scale;
                bgPixel.y = y * this.scale;

                this.display.backgroundGroup.addChild(bgPixel);

                this.display.imageGroup.addChild(this.image.setPixel(x, y).graphic);

                layer.setPixel(x, y, this.image.pixels[y * this.resolution + x].color);

                let line = new Graphics();
                line.lineStyle(1, 0x000000, 1);
                line.moveTo(0, y * this.scale);
                line.lineTo(this.resolution * this.scale, y * this.scale);

                this.display.gridGroup.addChild(line);
            }

            let line = new Graphics();
            line.lineStyle(1, 0x000000, 1);
            line.moveTo(x * this.scale, 0);
            line.lineTo(x * this.scale, this.resolution * this.scale);

            this.display.gridGroup.addChild(line);
        }

        this.offset.x = this.width / 2 - (this.resolution * this.scale) / 2;
        this.offset.y = this.height / 2 - (this.resolution * this.scale) / 2;

        for (let g in this.display) {
            this.display[g].x = this.offset.x;
            this.display[g].y = this.offset.y;
        }

        this.brush.updateCursor(true, true);

        this.app.stage.addChild(this.display.backgroundGroup, this.display.imageGroup);

        this.app.stage.addChild(this.brush.cursor.graphic);

        this.zoom(true);

        return this;
    }

    /**
     *
     * @param {PIXI.Application} app
     */
    constructor(app, resolution = 16) {
        /**
         * @type {PIXI.Application}
         */
        this.app = app;

        this.resolution = resolution;

        this.width = app.view.width;
        this.height = app.view.height;
        this.scale = (this.width < this.height
            ? this.width
            : this.height) / this.resolution;

        this.image.pixels = [];

        this.display = {
            backgroundGroup: new Container(),
            imageGroup: new Container(),
            gridGroup: new Container()
        };

        this.debug = {
            enabled: true,

            element: document.getElementById('debug'),

            update() {
                let pos = Mouse.getPosition();
                let x = Math.floor(pos.x / this.scale),
                    y = Math.floor(pos.y / this.scale);
                let pixel = this.image.pixels[y * this.resolution + x];

                if (!pixel)
                    return;

                this.debug.element.innerHTML =
                    `Mouse: ${JSON.stringify(pos)} --> ${x}, ${y}<br />` +
                    ` - ${JSON.stringify(Mouse.position.document)}<br />` +
                    ` - ${this.scale}<br />` +
                    'Brush:<br />' +
                    ` - Pos: ${this.brush.cursor.position.x}, ${this.brush.cursor.position.y} --> ${this.brush.cursor.position.x + this.brush.size - 1}, ${this.brush.cursor.position.y + this.brush.size - 1}<br />` +
                    ` - Style: ${this.brush.style}<br />` +
                    `Cursor: ${JSON.stringify(this.brush.cursor.position)}<br />` +
                    `Zoom: ${this.zoomSettings.width}, ${this.zoomSettings.height} | ${this.zoomSettings.value}<br />` +
                    ` - ${JSON.stringify(this.zoomSettings.offset)}`;
            }
        };

        this.offset = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };

        this.zoomSettings = {
            scale: 0,
            width: 0,
            height: 0,
            offset: {
                x: 0,
                y: 0
            },
            value: 0
        };

        this.brush = {
            style: 'pencil',
            fill: {
                r: 0, g: 0, b: 0, a: 255
            },
            size: 1,

            MousePos: null,
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
                graphic: new Graphics()
                    .beginFill(0xFFFFFF)
                    .drawRect(0, 0, this.scale, this.scale)
                    .endFill(),
                focus: null,
            },

            preview: null,

            getStyle: () => {
                return this.brush.style;
            },

            /**
             *
             * @param {string} style
             */
            setStyle: (style) => {
                switch (style) {
                    case 'eraser': {
                        this.brush.cursor.graphic.tint = 0xFFFFFF;
                        this.brush.cursor.graphic.alpha = 1;

                        break;
                    }
                    // eslint-disable-next-line
                    case 'fill': { }
                    // eslint-disable-next-line
                    case 'color-picker': {
                        this.brush.cursor.graphic.alpha = 0;

                        break;
                    }
                    default: {
                        this.brush.cursor.graphic.tint = colorize.rgbToHex(this.brush.fill.r, this.brush.fill.g, this.brush.fill.b);
                        this.brush.cursor.graphic.alpha = this.brush.fill.a / 255;

                        break;
                    }
                }

                this.brush.style = style;
            },

            getColor: () => {
                return {
                    r: this.brush.fill.r,
                    g: this.brush.fill.g,
                    b: this.brush.fill.b,
                    a: this.brush.fill.a
                };
            },

            /**
             *
             * @param {{r: number, g: number, b: number, a: number}} color
             */
            setColor: (color) => {
                this.brush.cursor.graphic.tint = colorize.rgbToHex(color.r, color.g, color.b);
                this.brush.cursor.graphic.alpha = color.a / 255;

                this.brush.fill = color;
            },

            getSize: () => {
                return this.brush.size;
            },

            setSize: (size) => {
                this.brush.size = size;
            },

            updateCursor: (updateColor = false, updateSize = false) => {
                this.brush.MousePos = Mouse.getPosition();

                this.brush.MousePos.x -= (this.zoomSettings.offset.x + this.offset.x);
                this.brush.MousePos.y -= (this.zoomSettings.offset.y + this.offset.y);

                this.brush.cursor.position.old.x = this.brush.cursor.position.x;
                this.brush.cursor.position.old.y = this.brush.cursor.position.y;

                this.brush.cursor.position.x = Math.floor(((this.brush.MousePos.x) - (this.brush.size - 1) / 2 * this.scale) / this.scale);
                this.brush.cursor.position.y = Math.floor(((this.brush.MousePos.y) - (this.brush.size - 1) / 2 * this.scale) / this.scale);

                if (this.brush.cursor.position.old.x !== this.brush.cursor.position.x || this.brush.cursor.position.old.y !== this.brush.cursor.position.y) {
                    this.brush.cursor.graphic.x = this.brush.cursor.position.x * this.scale + this.zoomSettings.offset.x + this.offset.x;
                    this.brush.cursor.graphic.y = this.brush.cursor.position.y * this.scale + this.zoomSettings.offset.y + this.offset.y;
                }

                if (updateColor) {
                    this.brush.cursor.graphic.tint = colorize.rgbToHex(this.brush.fill.r, this.brush.fill.g, this.brush.fill.b);
                    this.brush.cursor.graphic.alpha = this.brush.fill.a / 255;
                }

                if (updateSize) {
                    this.brush.cursor.graphic.width = this.scale * this.brush.size;
                    this.brush.cursor.graphic.height = this.scale * this.brush.size;
                }
            }
        };

        this.layers = {
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
                return this.layers.cache[layer];
            },

            /**
             *
             * @returns {Layer}
             */
            getActive: () => {
                return this.layers.cache[this.layers.active];
            },

            /**
             *
             * @returns {Layer}
             */
            add: () => {
                let index = this.layers.cache.length;
                let layer = new Layer(this);

                this.layers.cache.push(layer);
                this.layers.active = index;

                return layer;
            },

            remove: (index = -1) => {
                this.layers.cache.splice(index, 1);
                this.layers.reload();

                return this.layers;
            },

            /**
             *
             * @param {number} index
             * @param {number} newIndex
             * @returns {Layer}
             */
            move: (index, newIndex) => {
                let layer = this.layers.cache.splice(index, 1)[0];

                this.layers.cache.splice(newIndex, 0, layer);
                this.layers.reload();

                return layer;
            },

            clear: () => {
                this.layers.cache = [];
            },

            /**
             *
             * @param {number} layer
             */
            toggle: (layer) => {
                this.layers.cache[layer].visable = !this.layers.cache[layer].visable;
                this.layers.reload();
            },

            reload: () => {
                this.refresh = true;
            }
        };

        this.bounds = {
            doUpdate: false,

            /**
             * @type {DOMRect}
             */
            value: null,

            /**
             *
             * @returns {DOMRect}
             */
            update() {
                this.bounds.value = this.app.view.getBoundingClientRect();
                this.bounds.doUpdate = false;

                return this.bounds.value;
            }
        };

        this.grid = {
            enabled: false,

            show: () => {
                this.app.stage.removeChild(this.display.gridGroup);
                this.app.stage.addChild(this.display.gridGroup);
            },

            /**
             *
             * @returns {boolean}
             */
            toggle: () => {
                this.grid.enabled = !this.grid.enabled;

                if (this.grid.enabled)
                    this.app.stage.addChild(this.display.gridGroup);
                else
                    this.app.stage.removeChild(this.display.gridGroup);

                return this.grid.enabled;
            },
        };

        this.image = {
            pixels: [],
            buffer: [],

            setPixel: (x, y, color = null) => {
                this.image.pixels[y * this.resolution + x] = {
                    graphic: new Graphics(),
                    color: color === null
                        ? {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0
                        }
                        : color,
                    changed: false,
                    x,
                    y
                };

                this.image.pixels[y * this.resolution + x].graphic.beginFill(0xFFFFFF);
                this.image.pixels[y * this.resolution + x].graphic.drawRect(0, 0, this.scale, this.scale);
                this.image.pixels[y * this.resolution + x].graphic.endFill();

                this.image.pixels[y * this.resolution + x].graphic.tint = colorize.rgbColorToHex(this.image.pixels[y * this.resolution + x].color);
                this.image.pixels[y * this.resolution + x].graphic.alpha = this.image.pixels[y * this.resolution + x].color.a / 255;

                this.image.pixels[y * this.resolution + x].graphic.x = x * this.scale;
                this.image.pixels[y * this.resolution + x].graphic.y = y * this.scale;

                return this.image.pixels[y * this.resolution + x];
            },

            getPixel: (x, y) => {
                return this.image.pixels[y * this.resolution + x] || null;
            },

            updatePixel: (x, y) => {
                if (!this.image.pixels[y * this.resolution + x])
                    this.image.setPixel(x, y);

                let color = null;

                this.layers.cache.forEach((layer) => {
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

                this.image.pixels[y * this.resolution + x].color = color || { r: 0, g: 0, b: 0, a: 0 };
                this.image.pixels[y * this.resolution + x].graphic.tint = colorize.rgbColorToHex(this.image.pixels[y * this.resolution + x].color);
                this.image.pixels[y * this.resolution + x].graphic.alpha = this.image.pixels[y * this.resolution + x].color.a / 255;
            },

            compose: () => {
                const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
                canvas.width = this.resolution;
                canvas.height = this.resolution;

                let imgData = context.createImageData(this.resolution, this.resolution);

                let color;
                for (let x = 0; x < this.resolution; x++) {
                    for (let y = 0; y < this.resolution; y++) {
                        let v = (y * this.resolution + x) * 4;
                        color = this.image.getPixel(x, y).color;

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
                link.setAttribute('download', `${name
                    ? name
                    : 'texture'}.png`);
                link.click();
            },

            clear: () => {
                this.layers.cache.forEach((layer) => layer.clear());
                this.refresh = true;
            }
        };

        this.layers.clear();
        this.layers.add();

        this.create();
    }
}