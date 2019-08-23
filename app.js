App({
    globalData: {
        userInfo: null
    },
    util: require('./public/js/util.js'),
    api: null,
    onLaunch: function () {
        this.doUpdateApp();

        wx.cloud.init({
            env: 'release-b098f2',
            traceUser: true,
        });
        this.api = require('./public/js/api');
        // Page = require('./public/js/page');

        console.log("onLaunch");
    },

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
    },
    /**
     * 检查更新小程序
     */
    doUpdateApp() {
        let updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        });
        updateManager.onUpdateReady(function () {
            console.log(" updateManager.onUpdateReady");
            // updateManager.applyUpdate()
            wx.showModal({
                title: '更新提示',
                content: "新版本已经准备好，是否重启应用？ 1、增加了云存储更能，喜欢的颜色再也不怕丢失了; 2、优化了分享方式，可以保存朋友分享的卡片了。",
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        });
        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            console.log("updateManager.onUpdateFailed");
        })
    }
});