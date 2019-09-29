let utils = {};
utils.sysInfo = wx.getSystemInfoSync();

utils.menuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect();
utils.sysInfo.navigationHeight = utils.menuButtonBoundingClientRect.bottom + 8;

utils.sysInfo.isIOS = utils.sysInfo.system.indexOf('iOS') > -1;

utils.rpxToPx = function (rpx) {
    return rpx * utils.sysInfo.screenWidth / 750;
};
utils.pxToRpx = function (px) {
    return px * 750 / utils.sysInfo.screenWidth;
};


utils.rgbToHex = function (rgbStr) {
    console.log("rgbToHex rgbStr", rgbStr);
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(rgbStr)) {
        console.log("rgbToHex", 1);
        var aColor = rgbStr.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        console.log("rgbToHex aColor", aColor);
        var strHex = "";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            strHex += hex;
        }
        console.log("rgbToHex strHex", strHex);
        if (strHex.length !== 6) {
            strHex = rgbStr;
        }
        return strHex;
    } else if (reg.test(rgbStr)) {
        var aNum = rgbStr.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return rgbStr;
        } else if (aNum.length === 3) {
            var numHex = "";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return rgbStr;
};
utils.rgbToHsl = function (r, g, b) {
    let d, h, l, max, min, s;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = 0;
    s = 0;
    l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
        }
        h /= 6;
    }
    h = Math.ceil(h * 360);
    s = (Math.ceil(s * 100)) + "%";
    l = (Math.ceil(l * 100)) + "%";
    return [h, s, l];
};
utils.hexToRgb = function (hex) {
    if (hex.charAt && hex.charAt(0) === '#') {
        hex = utils.removeHash(hex)
    }
    if (hex.length === 3) {
        hex = utils.expand(hex)
    }
    let bigint = parseInt(hex, 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255

    return [r, g, b]
}

utils.removeHash = function (hex) {

    var arr = hex.split('')
    arr.shift()
    return arr.join('')
};

utils.expand = function (hex) {
    return hex
        .split('')
        .reduce(function (accum, value) {

            return accum.concat([value, value])
        }, [])
        .join('')
};
utils.hexToHsl = (hexColor) => {
    let rgb = utils.hexToRgb(hexColor),
        hsl = utils.rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return [hsl[0], parseInt(hsl[1], 10), parseInt(hsl[2], 10)];
};
utils.getColorTag = (hexColor) => {
    let hsl = utils.hexToHsl(hexColor);
    let hue = hsl[0],
        sat = hsl[1],
        lgt = hsl[2];
    if ((lgt / 100) < 0.2) return 'Blacks';
    if ((lgt / 100) > 0.85) return 'Whites';

    if ((sat / 100) < 0.20) return 'Grays';

    if (hue < 30) return 'Reds';
    if (hue < 60) return 'Oranges';
    if (hue < 90) return 'Yellows';
    if (hue < 150) return 'Greens';
    if (hue < 210) return 'Cyans';
    if (hue < 270) return 'Blues';
    if (hue < 330) return 'Magentas';

    return 'Reds';
};
/**
 * 判断是否在数组中
 * @param needle
 * @param array
 * @returns {boolean}
 */
utils.inArray = (needle, array) => {
    for (let i in array) {
        if (array[i] === needle) {
            return true;
        }
    }
    return false;
};
/**
 * 从数组删除
 * @param value
 * @param array
 * @returns {Array}
 */
utils.delFromArrayByValue = (value, array) => {
    let newArray = [];
    for (let i in array) {
        if (array[i] !== value) {
            newArray[newArray.length] = array[i];
        }
    }
    return newArray;
};
/**
 *
 * @param key
 * @param keyValue
 * @param array
 * @returns {null|*}
 */
utils.getArrayElement = (key, keyValue, array) => {
    for (let i in array) {
        if (array[i][key] !== keyValue) {
            return array[i];
        }
    }
    return null;
};
module.exports = utils;
