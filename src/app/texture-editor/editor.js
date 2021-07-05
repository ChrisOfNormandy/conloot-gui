import * as PIXI from 'pixi.js';
import mouse from './common/Mouse';

class Editor {
    app = null;

    currentColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    };
    background = [];

    width = 0;
    height = 0;
    scale = 0;

    debug = false;
    debugElem = document.getElementById('debug');

    pixels = [];
    showGrid = false;
    refresh = true;

    doBoundUpdate = true;
    bounds = null;

    type = "WebGL";

    loader = PIXI.Loader.shared;
    Sprite = PIXI.Sprite;
    Graphics = PIXI.Graphics;

    updateBounds = () => {
        let canvasBounds = this.app.view.getBoundingClientRect();

        this.bounds = {
            x: canvasBounds.x,
            y: canvasBounds.y,
            left: canvasBounds.left,
            right: canvasBounds.right,
            top: canvasBounds.top,
            bottom: canvasBounds.bottom,
            width: canvasBounds.width,
            height: canvasBounds.height
        };

        this.doBoundUpdate = false;

        this.refresh = true;
    }

    /**
     * 
     * @param {PIXI.Application} app 
     * @returns {HTMLCanvasElement}
     */
    startup = () => {
        this.onReady(() => this.app.ticker.add(() => this.draw()));

        return this.app.view;
    }

    onReady = (setup) => {
        console.log('App ready. Loading.');

        if (!PIXI.utils.isWebGLSupported()) {
            this.type = "canvas";
        }

        PIXI.utils.sayHello(this.type);

        this.loader
            .load(setup);
    }

    updateDebug = () => {
        if (this.debugElem === null)
            this.debugElem = document.getElementById('debug');

        if (!this.debug) {
            this.debugElem.innerHTML = "";
            return;
        }

        let mousePos = mouse.getPosition();

        this.debugElem.innerHTML =
            `Mouse: ${JSON.stringify(mousePos)} --> ${Math.floor(mousePos.x / 16)}, ${Math.floor(mousePos.y / 16)}<br />` +
            `Color: ${JSON.stringify(this.currentColor)}<br />` +
            `0x${this.decToHex(this.currentColor.r)}${this.decToHex(this.currentColor.g)}${this.decToHex(this.currentColor.b)}`;
    }

    draw = () => {
        this.updateDebug();

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                if (this.refresh)
                    this.setPixel(x, y, this.pixels[x][y].color);

                if (this.pixels[x][y].update) {
                    console.log(x, y, this.pixels[x][y].color);
                    this.app.stage.removeChild(this.pixels[x][y].graphic);

                    if (this.pixels[x][y].color.a < 255)
                        this.app.stage.addChild(this.background[y * 16 + x]);
                    else
                        this.app.stage.removeChild(this.background[y * 16 + x]);

                    if (this.pixels[x][y].color.a > 0)
                        this.app.stage.addChild(this.pixels[x][y].graphic);

                    this.pixels[x][y].update = false;
                }
            }
        }

        if (mouse.button.state) {
            let pos = mouse.getPosition();
            let x = Math.floor(pos.x / this.scale),
                y = Math.floor(pos.y / this.scale);

            if (x >= 0 && x < 16 && y >= 0 && y < 16) {
                if (mouse.button.id === 0)
                    this.setPixel(x, y, this.currentColor);
                else if (mouse.button.id === 2)
                    this.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0 });

                this.getPixel(x, y).update = true;
            }

            if (!mouse.inBounds)
                mouse.button.state = false;
        }

        this.refresh = false;
    }

    decToHex(c) {
        var hex = Number(c).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }

    clear() {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                this.setPixel(x, y, null);
            }
        }
    }

    rgbToHex(r, g, b) {
        return Number(`0x${this.decToHex(r)}${this.decToHex(g)}${this.decToHex(b)}`);
    }

    getPixel(x, y) {
        return !this.pixels[x] ? null : !this.pixels[x][y] ? null : this.pixels[x][y];
    }

    setPixel(x, y, color) {
        if (!this.pixels[x][y]) {
            this.pixels[x][y] = {
                color,
                graphic: new this.Graphics()
            }
        }

        this.pixels[x][y].graphic = new this.Graphics();

        if (this.showGrid)
            this.pixels[x][y].graphic.lineStyle(1, 0x000000, 1);

        if (color === null)
            this.pixels[x][y].graphic.beginFill(0x000000);
        else
            this.pixels[x][y].graphic.beginFill(this.rgbToHex(color.r, color.g, color.b));

        this.pixels[x][y].graphic.drawRect(0, 0, this.scale, this.scale);

        this.pixels[x][y].graphic.endFill();

        this.pixels[x][y].graphic.alpha = color === null ? 0 : color.a / 255;

        this.pixels[x][y].graphic.x = x * this.scale;
        this.pixels[x][y].graphic.y = y * this.scale;

        this.pixels[x][y].update = true;

        return this.pixels[x][y];
    }

    compose = () => {
        const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;

        let imgData = context.createImageData(16, 16);

        let color;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                let v = (y * 16 + x) * 4;
                color = this.getPixel(x, y).color;

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
        link.setAttribute('download', 'texture.png');
        link.click();
    }

    /**
     * 
     * @param {PIXI.Application} app 
     */
    constructor(app) {
        this.app = app;

        this.width = app.view.width;
        this.height = app.view.height;
        this.scale = this.width / 16;

        this.pixels = [];

        for (let x = 0; x < 16; x++) {
            this.pixels[x] = [];
            for (let y = 0; y < 16; y++) {
                this.background[y * 16 + x] = new this.Graphics();
                this.background[y * 16 + x].beginFill((x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0) ? 0xFFFFFF : 0xDDDDDD);
                this.background[y * 16 + x].drawRect(0, 0, this.scale, this.scale);
                this.background[y * 16 + x].endFill();

                this.background[y * 16 + x].x = x * this.scale;
                this.background[y * 16 + x].y = y * this.scale;

                this.setPixel(x, y, { r: 255 * x / 15, g: 0, b: 255 * y / 15, a: Math.floor((255 * x / 15 + 255 * y / 15) / 2) });
            }
        }
    }
}

export {
    Editor
}