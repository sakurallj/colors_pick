App({
    onLaunch: function() {
        if (!wx.cloud) {
            console.log('请使用 2.2.3 或以上的基础库以使用云能力')
            wx.setStorageSync("canNotWxCloud", true);
        } else {
            wx.cloud.init({
                env: 'release-b098f2',
                traceUser: true,
            })
            this.api = require('./utils/api.js');

            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'login',
            }).then(res => {
                console.log('  wx.cloud.callFunction then', res)
                wx.setStorageSync("openid", res.result.userInfo.openId);
            }, res => {
                console.log('  wx.cloud.callFunction then fail', res)
            }).catch(err => {
                console.log('  wx.cloud.callFunction catch', err)
            })
        }
    },
    globalData: {
        userInfo: null
    },
    api: null,
    createShareAppMessageParams: event => {
        console.log(event);
        wx.hideToast();
        let path = "pages/index/index",
            item = !!event && !!event.target && !!event.target.dataset && !!event.target.dataset.item ? event.target.dataset.item : null;
        if (item) {
            let str = JSON.stringify({
                color0: item.color0,
                color1: item.color1,
                color2: item.color2,
                color3: item.color3,
                isUGC: item.isUGC,
                fromShare: 1
            });
            path += "?item=" + str
        }
        console.log("createShareAppMessageParams", path);
        return {
            title: "你要的颜色都在这里",
            path: path
        }
    }
})