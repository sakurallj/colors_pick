//app.js
App({
    onLaunch: function() {
        wx.cloud.init({
            env: 'release-b098f2'
        })
    },
    globalData: {
        userInfo: null
    },
    api: {
        saveOneBuiltColor(index, item, callback) {
            let colors = wx.getStorageSync("colors");
            if (item.isUGC == 1) {
                let UGCArrs = colors.UGCArrs,
                    len = UGCArrs.length;
                if (index == -1) {
                    item.index = len;
                    UGCArrs[len] = item;
                } else {
                    UGCArrs[index] = item;
                }
            } else {
                if (!colors || !colors.builtInArrs[index]) {
                    wx.showToast({
                        title: '保存失败',
                        duration: 1000
                    })
                }
                colors.builtInArrs[index] = item;
            }
            wx.setStorageSync("colors", colors);
            typeof callback == "function" && callback();
        },
        deleteCard(item, callback) {
            let colors = wx.getStorageSync("colors");
            if (item.isUGC == 1) {
                colors.UGCArrs.splice(parseInt(item.data_index), 1);
            } else {
                colors.builtInArrs.splice(parseInt(item.data_index), 1);
            }
            wx.setStorageSync("colors", colors);
            typeof callback == "function" && callback();
        }
    },
    createShareAppMessageParams: function () {
        wx.hideToast();
        return {
            title: "你要的颜色都在这里"
        }
    }
})