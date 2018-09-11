let utils = {}
utils.getSystemWidth = function() {
    let info = wx.getStorageSync("system_info");
    if (!info) {
        info = wx.getSystemInfoSync();
        wx.setStorageSync("system_info", info);
    }
    return info;
}
utils.rpxToPx = function(rpx_num) {
    if (!rpx_num) {
        return 0;
    }
    let info = utils.getSystemWidth(),
        screenWidth = info.screenWidth;
    return rpx_num / (750 / screenWidth);
}
utils.pxToRpx = function(px_num) {
    if (!px_num) {
        return 0;
    }
    let info = utils.getSystemWidth(),
        screenWidth = info.screenWidth;
    return (750 / screenWidth) * px_num;
}

utils.rgbToHex = function(rgbStr) {
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
        } console.log("rgbToHex strHex", strHex);
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
module.exports = {
    utils: utils
}