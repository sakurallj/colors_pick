let apis = {};
let canNotWxCloud = wx.getStorageSync("canNotWxCloud"),
    db = null;
canNotWxCloud = !!canNotWxCloud;
if (!canNotWxCloud) {
    db = wx.cloud.database()
}
apis.saveOneBuiltColor = function(index, item, callback) {
    let colors = wx.getStorageSync("colors"),
        UGCArrs = colors.UGCArrs,
        len = UGCArrs.length;

    if (item.isUGC == 1) {
        if (index == -1) {
            item.index = len;
            UGCArrs[len] = item;
        } else {
            UGCArrs[index] = item;
        }
    } else if (item.fromShare == 1) {
        //判断ugc里面是否有系统的数据
        let can = true;
        for (let i = 0; i < len; i++) {
            let ugcItem = UGCArrs[i];
            console.log("saveOneBuiltColor", item, ugcItem);
            if (ugcItem.color0 == item.color0 &&
                ugcItem.color1 == item.color1 &&
                ugcItem.color2 == item.color2 &&
                ugcItem.color3 == item.color3) {
                can = false;
                break;
            }
        }
        if (can) {
            item.index = len;
            item.isUGC = 1;
            colors.UGCArrs[len] = item;
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
apis.saveColorsToCDB = function(colors, openid) {
    !!db && db.collection('colors').add({
            // data 字段表示需新增的 JSON 数据
            data: colors
        })
        .then(res => {
            console.log(res)
        })
}
apis.getMyColorFromCDB = function(callback) {
    return new Promise((resolve, reject) => {
        let openid = apis.getOpenid();
        if (!!openid) {
            console.log(openid);
            db.collection('colors').where({
                _openid: openid // 填入当前用户 openid
            }).limit(1).get().then(res => {
                console.log("apis.getColorsFromCDB ", res.data);
                resolve(res.data);
            }, res => {
                reject(res);
            })
        } else {
            reject("openid is null");
        }
    });
}
apis.getOpenid = function() {
    let openid = wx.getStorageSync("openid");
    return !!openid ? openid : null;
}
module.exports = apis