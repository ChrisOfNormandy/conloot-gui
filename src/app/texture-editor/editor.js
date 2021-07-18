import * as PIXI from 'pixi.js';

import mouse from './common/Mouse';

import Layer from './helpers/Layer';

import * as colorize from './helpers/colorize';
import * as distance from './helpers/distance';

const loader = PIXI.Loader.shared,
    Graphics = PIXI.Graphics;

const _ = {
    /**
     * @type {PIXI.Application}
     */
    app: null,

    display: {
        backgroundGroup: new PIXI.Container(),
        imageGroup: new PIXI.Container(),
        gridGroup: new PIXI.Container()
    },

    resolution: 0,

    refresh: false,

    width: 0,
    height: 0,
    scale: 0,

    debug: {
        enabled: true,

        element: document.getElementById('debug'),

        update: () => {
            let pos = mouse.getPosition();
            let x = Math.floor(pos.x / _.scale),
                y = Math.floor(pos.y / _.scale);
            let pixel = _.image.pixels[y * _.resolution + x];

            if (!pixel)
                return;

            _.debug.element.innerHTML =
                `Mouse: ${JSON.stringify(pos)} --> ${x}, ${y}<br />` +
                ` - ${JSON.stringify(mouse.position.document)}<br />` +
                ` - ${_.scale}<br />` +
                `Brush:<br />` +
                ` - Pos: ${_.brush.cursor.position.x}, ${_.brush.cursor.position.y} --> ${_.brush.cursor.position.x + _.brush.size - 1}, ${_.brush.cursor.position.y + _.brush.size - 1}<br />` +
                ` - Style: ${_.brush.style}<br />` +
                `Cursor: ${JSON.stringify(_.brush.cursor.position)}<br />` +
                `Zoom: ${_.zoomSettings.width}, ${_.zoomSettings.height} | ${_.zoomSettings.value}<br />` +
                ` - ${JSON.stringify(_.zoomSettings.offset)}`;
        },
    },

    offset: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },

    zoomSettings: {
        scale: 0,
        width: 0,
        height: 0,
        offset: {
            x: 0,
            y: 0
        },
        value: 0
    },

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

        preview: null,

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
                // eslint-disable-next-line
                case 'fill': {}
                // eslint-disable-next-line
                case 'color-picker': {
                    _.brush.cursor.graphic.alpha = 0;

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

            _.brush.mousePos.x -= (_.zoomSettings.offset.x + _.offset.x);
            _.brush.mousePos.y -= (_.zoomSettings.offset.y + _.offset.y);

            _.brush.cursor.position.old.x = _.brush.cursor.position.x;
            _.brush.cursor.position.old.y = _.brush.cursor.position.y;

            _.brush.cursor.position.x = Math.floor(((_.brush.mousePos.x) - (_.brush.size - 1) / 2 * _.scale) / _.scale);
            _.brush.cursor.position.y = Math.floor(((_.brush.mousePos.y) - (_.brush.size - 1) / 2 * _.scale) / _.scale);

            if (_.brush.cursor.position.old.x !== _.brush.cursor.position.x || _.brush.cursor.position.old.y !== _.brush.cursor.position.y) {
                _.brush.cursor.graphic.x = _.brush.cursor.position.x * _.scale + _.zoomSettings.offset.x + _.offset.x;
                _.brush.cursor.graphic.y = _.brush.cursor.position.y * _.scale + _.zoomSettings.offset.y + _.offset.y;
            }

            if (updateColor) {
                _.brush.cursor.graphic.tint = colorize.rgbToHex(_.brush.fill.r, _.brush.fill.g, _.brush.fill.b);
                _.brush.cursor.graphic.alpha = _.brush.fill.a / 255;
            }

            if (updateSize) {
                _.brush.cursor.graphic.width = _.scale * _.brush.size;
                _.brush.cursor.graphic.height = _.scale * _.brush.size;
            }            
        }
    },

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

        /**
         * 
         * @returns {Layer}
         */
        add: () => {
            let index = _.layers.cache.length;
            let layer = new Layer(editor);

            _.layers.cache.push(layer);
            _.layers.active = index;

            return layer;
        },

        remove: (index = -1) => {
            _.layers.cache.splice(index, 1);
            _.layers.reload();

            return _.layers;
        },

        /**
         * 
         * @param {number} index 
         * @param {number} newIndex 
         * @returns {Layer}
         */
        move: (index, newIndex) => {
            let layer = _.layers.cache.splice(index, 1)[0];

            _.layers.cache.splice(newIndex, 0, layer);
            _.layers.reload();

            return layer;
        },

        clear: () => {
            _.layers.cache = [];
        },

        /**
         * 
         * @param {number} layer 
         */
        toggle: (layer) => {
            _.layers.cache[layer].visable = !_.layers.cache[layer].visable;
            _.layers.reload();
        },

        reload: () => {
            _.refresh = true;
        }
    },

    bounds: {
        doUpdate: false,

        /**
         * @type {DOMRect}
         */
        value: null,

        /**
         * 
         * @returns {DOMRect}
         */
        update: () => {
            _.bounds.value = _.app.view.getBoundingClientRect();
            _.bounds.doUpdate = false;

            return _.bounds.value;
        }
    },    

    /**
     * 
     * @returns {HTMLCanvasElement}
     */
    startup: () => {
        _.onReady(() => _.app.ticker.add(() => _.draw()));

        return _.app.view;
    },

    /**
     * 
     * @param {()} setup 
     */
    onReady: (setup) => {
        console.log('App ready. Loading.');

        loader
            .load(setup);
    },

    grid: {
        enabled: false,

        show: () => {
            _.app.stage.removeChild(_.display.gridGroup);
            _.app.stage.addChild(_.display.gridGroup);
        },

        /**
         * 
         * @returns {boolean}
         */
        toggle: () => {
            _.grid.enabled = !_.grid.enabled;

            if (_.grid.enabled)
                _.app.stage.addChild(_.display.gridGroup);
            else
                _.app.stage.removeChild(_.display.gridGroup);

            return _.grid.enabled;
        },
    },    

    draw: () => {
        if (_.debug.element === null) {
            _.debug.element = document.getElementById('debug');
            return;
        }

        if (_.debug.enabled) {
            if (_.debug.element.classList.contains('hidden'))
                _.debug.element.classList.remove('hidden');

            _.debug.update();
        }
        else if (!_.debug.element.classList.contains('hidden'))
            _.debug.element.classList.add('hidden')

        if (_.refresh) {
            _.image.pixels.forEach(pixel => {
                _.image.updatePixel(pixel.x, pixel.y);

                _.app.stage.removeChild(pixel.graphic);
                _.app.stage.addChild(pixel.graphic);
            });

            _.app.stage.removeChild(_.brush.cursor.graphic);
            _.app.stage.addChild(_.brush.cursor.graphic);

            if (_.grid.enabled)
                _.grid.show();

            _.refresh = false;

            return;
        }

        _.image.buffer.forEach((pixel, i) => {
            _.image.updatePixel(pixel.x, pixel.y);

            if (pixel.changed) {
                if (!mouse.button.state)
                    pixel.changed = false;
            }
            else
                _.image.buffer.splice(i, 1);
        });

        _.brush.updateCursor();

        let layer = _.layers.getActive();
        let buf;

        let color, ignoreChange, alpha;

        if (!!layer) {
            if (mouse.clicked) {
                switch(_.brush.style) {
                    case 'fill': {
                        let position = {
                            x: _.brush.cursor.position.x,
                            y: _.brush.cursor.position.y
                        };

                        let origin = {
                            color: layer.getPixel(position.x, position.y).color
                        };

                        color = _.brush.getColor();
                        ignoreChange = false;
                        alpha = null;

                        let filled = [];

                        function checkColor(color1, color2, tollerance = 5) {
                            return (
                                Math.abs(color1.r - color2.r) <= tollerance &&
                                Math.abs(color1.g - color2.g) <= tollerance &&
                                Math.abs(color1.b - color2.b) <= tollerance &&
                                Math.abs(color1.a - color2.a) <= tollerance
                            )
                        }

                        function fill(pos) {
                            let pixel = layer.getPixel(pos.x, pos.y);

                            if (pixel === null || !checkColor(pixel.color, origin.color) || pos.x < 0 || pos.y >= _.resolution || pos.y < 0 || pos.y >= _.resolution)
                                return;

                            buf = filled.includes(pos) ? null : layer.updatePixel(pos.x, pos.y, color, ignoreChange, alpha);

                            if (buf !== null) {
                                _.image.buffer.push(buf);
                                filled.push(pos);

                                fill({ x: pos.x - 1, y: pos.y });
                                fill({ x: pos.x + 1, y: pos.y });
                                fill({ x: pos.x, y: pos.y - 1 });
                                fill({ x: pos.x, y: pos.y + 1 });
                            }
                        }

                        fill(position);
                        break;
                    }
                    case 'color-picker': {
                        let color = layer.getPixel(_.brush.cursor.position.x, _.brush.cursor.position.y).color;

                        _.brush.setColor(color);
                        _.brush.preview.update();
                        _.brush.updateCursor(true);

                        break;
                    }
                    default: { break; }
                }
            }
            else if (mouse.button.state) {
                if (mouse.button.id === 0) {
                    switch (_.brush.style) {
                        case 'fill': {}
                        // eslint-disable-next-line
                        case 'color-picker': { break; }
                        default: {
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
                                        _.image.buffer.push(buf);
                                }
                            }

                            break;
                        }
                    }
                }
            }
        }

        if (!mouse.inBounds)
            mouse.button.state = false;

        mouse.clicked = false;
    },

    image: {
        pixels: [],
        buffer: [],

        setPixel: (x, y, color = null) => {
            _.image.pixels[y * _.resolution + x] = {
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

            _.image.pixels[y * _.resolution + x].graphic.beginFill(0xFFFFFF);
            _.image.pixels[y * _.resolution + x].graphic.drawRect(0, 0, _.scale, _.scale);
            _.image.pixels[y * _.resolution + x].graphic.endFill();

            _.image.pixels[y * _.resolution + x].graphic.tint = colorize.rgbColorToHex(_.image.pixels[y * _.resolution + x].color);
            _.image.pixels[y * _.resolution + x].graphic.alpha = _.image.pixels[y * _.resolution + x].color.a / 255;

            _.image.pixels[y * _.resolution + x].graphic.x = x * _.scale;
            _.image.pixels[y * _.resolution + x].graphic.y = y * _.scale;

            return _.image.pixels[y * _.resolution + x];
        },

        getPixel: (x, y) => {
            return _.image.pixels[y * _.resolution + x] || null;
        },

        updatePixel: (x, y) => {
            if (!_.image.pixels[y * _.resolution + x])
                _.image.setPixel(x, y);

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

            _.image.pixels[y * _.resolution + x].color = color || { r: 0, g: 0, b: 0, a: 0 };
            _.image.pixels[y * _.resolution + x].graphic.tint = colorize.rgbColorToHex(_.image.pixels[y * _.resolution + x].color);
            _.image.pixels[y * _.resolution + x].graphic.alpha = _.image.pixels[y * _.resolution + x].color.a / 255;
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
                    color = _.image.getPixel(x, y).color;

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

        clear: () => {
            _.layers.cache.forEach(layer => layer.clear());
            _.refresh = true;
        }
    },
    
    /**
     * 
     * @param {boolean} amount 
     */
    zoom: (amount) => {
        if ((amount && _.zoomSettings.scale <= -9) || (!amount && _.zoomSettings.scale >= 20))
            return;

        _.zoomSettings.scale += amount ? -1 : 1;

        _.zoomSettings.value = _.zoomSettings.scale < 0 ? (10 + _.zoomSettings.scale) / 10 : 1 + _.zoomSettings.scale / 10;

        _.zoomSettings.width = (_.app.view.width < _.app.view.height ? _.app.view.width : _.app.view.height) * _.zoomSettings.value;
        _.zoomSettings.height = _.zoomSettings.width;
        _.zoomSettings.offset.x = (_.app.view.width - _.zoomSettings.width) / 2;
        _.zoomSettings.offset.y = (_.app.view.height - _.zoomSettings.height) / 2;

        for (let g in _.display) {
            _.display[g].width = _.zoomSettings.width;
            _.display[g].height = _.zoomSettings.height;
            _.display[g].x = _.zoomSettings.offset.x;
            _.display[g].y = _.zoomSettings.offset.y;
        }

        _.scale = (_.display.imageGroup.width < _.display.imageGroup.height ? _.display.imageGroup.width : _.display.imageGroup.height) / _.resolution;

        _.scale *= _.zoomSettings.value;

        _.brush.updateCursor(false, true);
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
        _.scale = (_.width < _.height ? _.width : _.height) / _.resolution;

        _.image.pixels = [];

        _.layers.clear();
        _.layers.add();

        _.brush.cursor.graphic = new Graphics();
        _.brush.cursor.graphic.beginFill(0xFFFFFF);
        _.brush.cursor.graphic.drawRect(0, 0, _.scale, _.scale);
        _.brush.cursor.graphic.endFill();

        let layer = _.layers.get(_.layers.active);

        let bgPixel;
        for (let x = 0; x < _.resolution; x++) {
            for (let y = 0; y < _.resolution; y++) {
                bgPixel = new Graphics();
                bgPixel.beginFill(0xFFFFFF);
                bgPixel.drawRect(0, 0, _.scale, _.scale);
                bgPixel.endFill();

                bgPixel.tint = (x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0) ? 0xFFFFFF : 0xDDDDDD;

                bgPixel.x = x * _.scale;
                bgPixel.y = y * _.scale;

                _.display.backgroundGroup.addChild(bgPixel);

                _.display.imageGroup.addChild(_.image.setPixel(x, y).graphic);

                layer.setPixel(x, y, _.image.pixels[y * _.resolution + x].color);

                let line = new PIXI.Graphics();
                line.lineStyle(1, 0x000000, 1);
                line.moveTo(0, y * _.scale);
                line.lineTo(_.resolution * _.scale, y * _.scale);

                _.display.gridGroup.addChild(line);
            }

            let line = new PIXI.Graphics();
            line.lineStyle(1, 0x000000, 1);
            line.moveTo(x * _.scale, 0);
            line.lineTo(x * _.scale, _.resolution * _.scale);

            _.display.gridGroup.addChild(line);
        }

        _.offset.x = _.width / 2 - (_.resolution * _.scale) / 2;
        _.offset.y = _.height / 2 - (_.resolution * _.scale) / 2;

        for (let g in _.display) {
            _.display[g].x = _.offset.x;
            _.display[g].y = _.offset.y;
        }

        _.brush.updateCursor(true, true);

        _.app.stage.addChild(_.display.backgroundGroup, _.display.imageGroup);

        _.app.stage.addChild(_.brush.cursor.graphic);

        _.zoom(true);

        return _;
    }
}

const editor = _;

export {
    editor
}