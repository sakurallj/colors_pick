let utils = {}
utils.getSystemWidth=function(){
    let info = wx.getStorageSync("system_info");
    if (!info){
        info = wx.getSystemInfoSync();
    }
    console.log(info)
    return info;
}
utils.rpxToPx  = function (rpx_num) {
    if (!rpx_num) {
        return 0;
    }
    let info = utils.getSystemWidth(), screenWidth = info.screenWidth;
    return rpx_num / (750 / screenWidth);
}
utils.pxToRpx=function(px_num){
    if (!px_num){
        return 0;
    }
    let info = utils.getSystemWidth(), screenWidth = info.screenWidth;
    return (750 / screenWidth) * px_num ;
}
module.exports = {
    utils: utils
}
