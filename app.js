App({
    globalData: {
        userInfo: null
    },
    util: require('./public/js/util.js'),
    api: null,
    onLaunch: function () {
        this.doUpdateApp();
        this.api = require('./public/js/api');
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
                content: "新版本已经准备好，是否重启应用？",
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