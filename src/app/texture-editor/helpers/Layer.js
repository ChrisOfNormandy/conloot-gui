import * as colorize from './colorize';

export default class Layer {
    editor;

    resolution;

    name;

    visable = true;
    opacity = 255;
    pixels = [];

    clear = () => {
        this.pixels.forEach(pixel => this.setPixel(pixel.x, pixel.y, null));
    }

    getPixel = (x, y) => {
        if (this.visable)
            return !this.pixels[y * this.resolution + x]
                ? null
                : this.pixels[y * this.resolution + x];
        return {
            x, y, changed: this.pixels[y * this.resolution + x].changed, color: { r: 0, g: 0, b: 0, a: 0 }
        }
    }

    toggle = () => {
        this.visable = !this.visable;
        this.editor.refresh = true;
    }

    updatePixel = (x, y, color, ignoreChange = false, alpha = null) => {
        let pixel = this.getPixel(x, y);

        if (pixel === null || (pixel.changed && !ignoreChange))
            return null;

        if (alpha === null) {
            pixel.color = color === null ? { r: 0, g: 0, b: 0, a: 0 } : colorize.calculatePixelColor(pixel.color, color);
            pixel.changed = true;
        }
        else
            pixel.color.a = (pixel.color.a / 255) * alpha;

        return pixel;
    }

    setPixel = (x, y, color = null) => {
        this.pixels[y * this.resolution + x] = {
            color: color === null ? { r: 0, g: 0, b: 0, a: 0 } : color,
            x,
            y,
            changed: false
        };

        return this.pixels[y * this.resolution + x];
    }

    constructor(editor, name = null) {
        this.editor = editor;
        this.resolution = editor.resolution;

        if (name === null) {
            let arr = this.editor.layers.cache.map(layer => {
                return layer.name;
            });

            if (!arr.length)
                this.name = 'Layer 1';
            else {
                let index = 1;

                this.name = `Layer ${index}`;

                while (arr.includes(this.name)) {
                    this.name = `Layer ${index}`;
                    index++;
                }
            }
        }
        else
            this.name = name;

        for (let x = 0; x < editor.resolution; x++) {
            for (let y = 0; y < editor.resolution; y++) {
                this.setPixel(x, y);
            }
        }
    }
}