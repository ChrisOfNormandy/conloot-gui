function decToHex(c) {
    var hex = Number(c).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}


function rgbToHex(r, g, b) {
    return Number(`0x${decToHex(r)}${decToHex(g)}${decToHex(b)}`);
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
    if (color2.a === 0)
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
    rgbToHsv,
    hsvToRgb,
    interpolate,
    calculatePixelColor
}