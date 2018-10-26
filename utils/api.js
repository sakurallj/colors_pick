let default_colors = require('./default_colors.js');
let apis = {};
let canNotWxCloud = wx.getStorageSync("canNotWxCloud"),
    db = null;
canNotWxCloud = !!canNotWxCloud;
if (!canNotWxCloud) {
    db = wx.cloud.database()
}
apis.saveOneBuiltColor = function(index, item) {
    return new Promise((resolve, reject) => {
        let colors = wx.getStorageSync("colors"),
            UGCArrs = colors.UGCArrs,
            len = UGCArrs.length;
        if (item.isUGC == 1 || item.fromShare == 1) {
            //判断ugc里面是否有系统的数据
            for (let i = 0; i < len; i++) {
                let ugcItem = UGCArrs[i];
                if (ugcItem.color0 == item.color0 &&
                    ugcItem.color1 == item.color1 &&
                    ugcItem.color2 == item.color2 &&
                    ugcItem.color3 == item.color3) {
                    reject(ugcItem);
                    return false;
                }
            }
            item.index = len;
            item.isUGC = 1;
            colors.UGCArrs[len] = item;
        } else {
            if (!colors || !colors.builtInArrs[index]) {
                reject("保存失败，请重试");
                return false;
            }
            colors.builtInArrs[index] = item;
        }
        wx.setStorageSync("colors", colors);
        apis.updateColorsToCDB(colors).then(colors => {
            resolve(colors);
        }, res => {
            reject(res);
        });;
    });
}
apis.deleteCard = function(item, callback) {
    let colors = wx.getStorageSync("colors");
    if (item.isUGC == 1) {
        colors.UGCArrs.splice(parseInt(item.data_index), 1);
    } else {
        colors.builtInArrs.splice(parseInt(item.data_index), 1);
    }
    wx.setStorageSync("colors", colors);
    apis.updateColorsToCDB(colors);
    typeof callback == "function" && callback();
}
apis.addColorsToCDB = function(colors) {
    return new Promise((resolve, reject) => {
        !!db && db.collection('colors')
            .add({
                data: colors
            })
            .then(res => {
                console.log(res);
                resolve(res);
            }, res => {
                reject(res);
            })
    });
}
apis.updateColorsToCDB = function(colors) {
    return new Promise((resolve, reject) => {
        let color_id = wx.getStorageSync("color_id");
        if (!color_id) {
            reject("color_id is null");
        } else {
            db.collection('colors').doc(color_id).update({
                data: {
                    builtInArrs: colors.builtInArrs,
                    UGCArrs: colors.UGCArrs,
                }
            }).then(res => {
                console.log("apis.updateColorsToCDB db.collection success res ", res);
                resolve(res);
            }, res => {
                console.log("apis.updateColorsToCDB db.collection fail res", res);
                reject(res);
            });
        }
    });
}
apis.getMyColorsFromCDB = function(callback) {
    return new Promise((resolve, reject) => {
        apis.getOpenid().then(res => {
            let openid = res;
            console.log("getMyColorsFromCDB openid", openid);
            db.collection('colors').where({
                _openid: openid // 填入当前用户 openid
            }).limit(1).get().then(res => {
                console.log("apis.getMyColorsFromCDB db.collection success res.data", res.data);
                resolve(res.data);
            }, res => {
                console.log("apis.getMyColorsFromCDB db.collection fail res", res);
                reject(res);
            })
        }, res => {
            console.log("apis.getMyColorsFromCDB   apis.getOpenid fail ", res);
            reject(res);
        });
    });
}
apis.getOpenid = function() {
    return new Promise((resolve, reject) => {
        let openid = wx.getStorageSync("openid");
        if (!!openid) {
            resolve(openid);
        } else {
            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'login',
            }).then(res => {
                console.log('apis.getOpenid wx.cloud.callFunction then success res', res)
                let openid = res.result.userInfo.openId;
                if (openid) {
                    wx.setStorageSync("openid", openid);
                    resolve(openid);
                } else {
                    reject("openid is null");
                }
            }, res => {
                console.log('apis.getOpenid wx.cloud.callFunction then fail res', res)
                reject("get openid fail");
            }).catch(err => {
                console.log('apis.getOpenid wx.cloud.callFunction catch res', err)
                reject("get openid fail");
            })
        }
    });
}

apis.initColors = function() {
    return new Promise((resolve, reject) => {
        let colors = wx.getStorageSync("colors");
        if (colors) {
            resolve(colors);
        } else {
            wx.showLoading({
                title: '初始化中...',
            })
            apis.getMyColorsFromCDB().then(res => {
                console.log("apis.initColors apis.getMyColorsFromCDB success", res);
                let data = res[0];
                if (!data || !data.builtInArrs) {
                    apis.setColorsToDefaultColors().then(colors => {
                        wx.hideLoading();
                        resolve(colors);
                    }, res => {
                        wx.hideLoading();
                        reject(res);
                    });
                } else {
                    colors = {
                        builtInArrs: data.builtInArrs,
                        UGCArrs: !data.UGCArrs ? [] : data.UGCArrs
                    };
                    wx.setStorageSync("colors", colors);
                    wx.setStorageSync("color_id", data._id);
                    wx.hideLoading();
                    resolve(colors);
                }
            }, res => {
                console.log("getMyColorsFromCDB fail", res);
                apis.setColorsToDefaultColors().then(colors => {
                    wx.hideLoading();
                    resolve(colors);
                }, res => {
                    wx.hideLoading();
                    reject(res);
                });
            });
        }
    });
}
apis.setColorsToDefaultColors = function() {
    console.log("apis.setColorsToDefaultColors ");
    return new Promise((resolve, reject) => {
        let colors = default_colors.colors;
        wx.setStorageSync("colors", colors);
        apis.addColorsToCDB(colors).then(res => {
            console.log("apis.setColorsToDefaultColors apis.addColorsToCDB success res", res);
            wx.setStorageSync("color_id", res._id);
            resolve(colors);
        }, res => {
            console.log("apis.setColorsToDefaultColors apis.addColorsToCDB fail res", res);
            reject(res);
        });
    });

}
module.exports = apis