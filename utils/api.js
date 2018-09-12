let apis = {};
let canNotWxCloud = wx.getStorageSync("canNotWxCloud"),
    db = null;
canNotWxCloud = !!canNotWxCloud;
if (!canNotWxCloud) {
    db = wx.cloud.database()
}
apis.saveOneBuiltColor = function(index, item, callback) {
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
    apis.saveColorsToCDB(colors);
    apis.getColorsFromCDB();
    typeof callback == "function" && callback();
}
apis.deleteCard = function(item, callback) {
    let colors = wx.getStorageSync("colors");
    if (item.isUGC == 1) {
        colors.UGCArrs.splice(parseInt(item.data_index), 1);
    } else {
        colors.builtInArrs.splice(parseInt(item.data_index), 1);
    }
    wx.setStorageSync("colors", colors);
    apis.saveColorsToCDB(colors);
    typeof callback == "function" && callback();
}
apis.saveColorsToCDB = function(colors) {
    !!db && db.collection('colors').add({
            // data 字段表示需新增的 JSON 数据
            data: colors
        })
        .then(res => {
            console.log(res)
        })
}
apis.getColorsFromCDB = function(callback) {
    db.collection('colors').get({
        success: function(res) {
            console.log(res.data)
            typeof callback == "function" && callback(res.data);
        },
        fail: function (res) {
            console.log(res)
            typeof callback == "function" && callback(res);
        }
    })
}
module.exports = apis