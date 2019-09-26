import db from '../data/db';
import interceptor from '../interceptor';

let cc = {};
cc.login = function () {
    return cc.getOpenid();
};

cc.getOpenid = function () {
    return new Promise((resolve, reject) => {
        let openid = wx.getStorageSync("openid");
        if (!!openid) {
            resolve(openid);
        } else {
            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'login',
            }).then(res => {
                console.log('apis.getOpenid wx.cloud.callFunction then success res', res);
                let openid = res.result.userInfo.openId;
                if (openid) {
                    wx.setStorageSync("openid", openid);
                    resolve(openid);
                } else {
                    reject("openid is null");
                }
            }, res => {
                console.log('apis.getOpenid wx.cloud.callFunction then fail res', res);
                reject("get openid fail");
            }).catch(err => {
                console.log('apis.getOpenid wx.cloud.callFunction catch res', err);
                reject("get openid fail");
            })
        }
    });
};
cc.getOpenIdFromCache = () => {
    return wx.getStorageSync("openid");
};
module.exports = cc;