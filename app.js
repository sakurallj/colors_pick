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
        }
    },
    globalData: {
        userInfo: null
    },
    api: null,
    createShareAppMessageParams: function() {
        wx.hideToast();
        return {
            title: "你要的颜色都在这里"
        }
    }
})