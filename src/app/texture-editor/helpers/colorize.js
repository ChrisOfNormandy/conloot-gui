function decToHex(c) {
    var hex = Number(c).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

function hexToDec(c) {
    return parseInt(c, 16);
}

function rgbToHex(r, g, b, a = null) {
    return Number(`0x${decToHex(r)}${decToHex(g)}${decToHex(b)}${a !== null ? decToHex(a) : ''}`);
}

function rgbToHexString(r, g, b, a = null) {
    return `${decToHex(r)}${decToHex(g)}${decToHex(b)}${a !== null ? decToHex(a) : ''}`;
}

function hexToRgb(hex) {
    switch (hex.length) {
        case 0: return {r: 0, g: 0, b:0, a: 255}
        case 1: return {r: hexToDec(hex), g: hexToDec(hex), b: hexToDec(hex), a: 255}
        case 3: {
            let rgb = hex.split('');
            return { r: hexToDec(`${rgb[0] + rgb[0]}`), g: hexToDec(`${rgb[1] + rgb[1]}`), b: hexToDec(`${rgb[2] + rgb[2]}`), a: 255 }
        }
        case 4: {
            let rgba = hex.split('');
            return { r: hexToDec(`${rgba[0] + rgba[0]}`), g: hexToDec(`${rgba[1] + rgba[1]}`), b: hexToDec(`${rgba[2] + rgba[2]}`), a: hexToDec(`${rgba[3] + rgba[3]}`) }
        }
        case 6: {
            let rgb = hex.split('');
            return { r: hexToDec(`${rgb[0] + rgb[1]}`), g: hexToDec(`${rgb[2] + rgb[3]}`), b: hexToDec(`${rgb[4] + rgb[5]}`) }
        }
        case 8: {
            let rgb = hex.split('');
            return { r: hexToDec(`${rgb[0] + rgb[1]}`), g: hexToDec(`${rgb[2] + rgb[3]}`), b: hexToDec(`${rgb[4] + rgb[5]}`), a: hexToDec(`${rgb[6] + rgb[7]}`) }
        }
        default: return {r: 0, g: 0, b: 0, a: 255}
    }
}

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));

    return {
        h: 60 * (h < 0 ? h + 6 : h),
        s: v && c / v,
        v
    };
}

function rgbColorToHex(color) {
    return rgbToHex(color.r, color.g, color.b);
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: {
            r = v;
            g = t;
            b = p;
            break;
        }
        case 1: {
            r = q;
            g = v;
            b = p;
            break;
        }
        case 2: {
            r = p;
            g = v;
            b = t;
            break;
        }
        case 3: {
            r = p;
            g = q;
            b = v;
            break;
        }
        case 4: {
            r = t;
            g = p;
            b = v;
            break;
        }
        case 5: {
            r = v;
            g = p;
            b = q;
            break;
        }
        default: return null;
    }

    return [r * 255, g * 255, b * 255];
}

function interpolate(v1, v2, a) {
    return Math.floor((v2 * a) + (v1 * (1 - a)));
}

function calculatePixelColor(color1, color2) {
    if (color1.a === 0)
        return color2;
    if (color2.a === 0 || !color2)
        return color1;

    return {
        r: interpolate(color1.r, color2.r, color2.a / 255),
        g: interpolate(color1.g, color2.g, color2.a / 255),
        b: interpolate(color1.b, color2.b, color2.a / 255),
        a: (color1.a + color2.a) > 255 ? 255 : color1.a + color2.a
    }
}

export {
    decToHex,
    rgbToHex,
    rgbToHexString,
    hexToDec,
    hexToRgb,
    rgbColorToHex,
    rgbToHsv,
    hsvToRgb,
    interpolate,
    calculatePixelColor
}