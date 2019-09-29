import db from '../data/db';
import interceptor from '../interceptor';
import util from '../util';
import userService from './user';

let cc = {
    DEFAULT_MY_PANTONE_COLLECTIONS: ["formula_guide_solid_coated", "formula_guide_solid_uncoated", "color_bridge_coated"],
    USER_COLLECTIONS_NAME: "userCollections",
    LC_MY_PANTONE_IDS_KEY: "myPantoneIds",
    D_C_COLORS: "cColors",
};
/**
 * 获得潘通指南
 * @type {{layout: string, list: (*|Array)}}
 */
cc.getPantoneGuides = () => {
    return new Promise((resolve, reject) => {
        resolve(db.pantoneGuides.guides);
    });
};

/**
 * 获得我收藏的潘通指南
 * @type {function(): Promise<any>}
 */
cc.getMyPantoneCollectionIds = interceptor.waitOpenIdInterceptor(() => {
    let openId = userService.getOpenIdFromCache();
    return new Promise((resolve, reject) => {
        let myPantoneIds = wx.getStorageSync(cc.LC_MY_PANTONE_IDS_KEY);
        if (!!myPantoneIds) {
            resolve(myPantoneIds);
            return true;
        }
        db.cloudDB.collection(cc.USER_COLLECTIONS_NAME).where({
            _openid: openId,
            type: "panton"
        }).limit(1).get().then(res => {
            console.log("cc.getMyPantoneCollectionIds", res);
            let list = null,
                data = {};
            if (res.data.length > 0) {
                data = res.data[0];
                list = data.list;
            }
            if (!list) {
                list = cc.DEFAULT_MY_PANTONE_COLLECTIONS;
            }
            data.list = list;
            wx.setStorageSync(cc.LC_MY_PANTONE_IDS_KEY, data);
            resolve(data);
        }, res => {
            let data = {
                list: cc.DEFAULT_MY_PANTONE_COLLECTIONS
            };
            wx.setStorageSync(cc.LC_MY_PANTONE_IDS_KEY, data);
            resolve(data);
        })
    });
});
/**
 * 处理 潘通指南
 * @param myPantoneIds
 * @param allpantoneGuides
 * @returns {{layout: string, list: {layout: string, bgType: string, subTitle: string, outBgColorValue: string, title: string, bgColorValue: string}[]}}
 */
cc.formatPantoneCollections = (myPantoneIds, allpantoneGuides) => {
    let rtnData = [{
        layout: "tip",
        title: "试着在这里\n寻找您的色彩灵感吧！",
        subTitle: "您可以轻触各个色集上的心形按钮来编辑您色彩集内的指南",
        outBgColorValue: "#2F244C",
        bgColorValue: "#443C5E",
        bgType: "color",
    }];
    rtnData[0].style = "background: " + rtnData[0].bgColorValue + ";";
    rtnData[0].outStyle = "background: " + rtnData[0].outBgColorValue + ";";
    for (let pI in allpantoneGuides) {
        allpantoneGuides[pI].isLike = false;
    }
    for (let i in myPantoneIds) {
        for (let pI in allpantoneGuides) {
            if (allpantoneGuides[pI].id === myPantoneIds[i]) {
                allpantoneGuides[pI].isLike = true;
                rtnData[rtnData.length] = allpantoneGuides[pI];
                break;
            }
        }
    }
    return {
        allGuides: {
            layout: "list",
            list: allpantoneGuides
        },
        myGuides: {
            layout: "swiper",
            list: rtnData
        }
    };
};

cc.getPantonePageData = () => {
    return new Promise((resolve, reject) => {
        cc.getPantoneGuides().then(allpantoneGuides => {
            console.log("     cc.getPantoneGuides", allpantoneGuides);
            cc.getMyPantoneCollectionIds().then(res => {
                let myPantoneIds = res.list;
                resolve(cc.formatPantoneCollections(myPantoneIds, allpantoneGuides));
            }, res => {
                resolve(cc.formatPantoneCollections(cc.DEFAULT_MY_PANTONE_COLLECTIONS, allpantoneGuides));
            })
        }, res => {
            reject(res)
        });
    });
};
/**
 * 清空我的收藏的本地缓存
 */
cc.clearMyPantoneCollectionIdsCache = () => {
    wx.removeStorageSync(cc.LC_MY_PANTONE_IDS_KEY);
};
/**
 * 收藏
 * @type {function(): Promise<any>}
 */
cc.saveLike = interceptor.waitOpenIdInterceptor((cId) => {
    let openId = userService.getOpenIdFromCache();
    return new Promise((resolve, reject) => {
        cc.getMyPantoneCollectionIds().then(res => {
            console.log("   cc.saveLike  cc.getMyPantoneCollectionIds", res);
            let list = res.list;
            if (util.inArray(cId, list)) {
                list = util.delFromArrayByValue(cId, list);
            } else {
                list[list.length] = cId;
            }

            cc.clearMyPantoneCollectionIdsCache();
            if (!!res._id) { //更新

                db.cloudDB.collection(cc.USER_COLLECTIONS_NAME).doc(res._id).update({
                    data: {
                        list: list
                    }
                }).then(res => {
                    console.log(res);
                    resolve(res);
                }, res => {
                    reject(res);
                });
            } else { //新增
                db.cloudDB.collection(cc.USER_COLLECTIONS_NAME)
                    .add({
                        data: {
                            type: "panton",
                            list: list
                        }
                    })
                    .then(res => {
                        console.log(res);
                        resolve(res);
                    }, res => {
                        reject(res);
                    })
            }
        }, res => {
            reject(res);
        });

    });
});
/**
 * 判断是否已经收藏
 * @type {function(): Promise<any>}
 */
cc.isLike = (cId) => {
    return new Promise((resolve, reject) => {
        cc.getMyPantoneCollectionIds().then(res => {
            console.log("cc.isLike ", res);
            let list = res.list;
            if (util.inArray(cId, list)) {
                console.log("cc.isLike ", cId, list, true);
                resolve({
                    isLike: true
                });
            } else {
                console.log("cc.isLike ", cId, list, false);
                resolve({
                    isLike: false
                });
            }
        }, res => {
            resolve({
                isLike: false
            });
        });

    });
};
/**
 *
 * @param cId
 * @returns {Promise<any>}
 */
cc.getDetailById = (cId) => {
    return new Promise((resolve, reject) => {
        cc.getPantoneGuides().then(allpantoneGuides => {
            let col = util.getArrayElement("id", cId, allpantoneGuides);
            console.log("cc.getDetailById", "id", col, cId, allpantoneGuides);
            if (!col) {
                reject({});
                return false;
            }
            col.list = db.test;
            cc.isLike(cId).then(res => {
                col.isLike = res.isLike;
                resolve(col);
            }, res => {
                resolve(col);
            });
        }, res => {});
    });
};

cc.getColorsByCId = (cId) => {
    return new Promise((resolve, reject) => {
        db.cloudDB.collection(cc.D_C_COLORS).where({
            paletteID: cId
        }).limit(10000).get().then(res => {
            console.log("cc.getColorsByCId", res);
            resolve(res);
        }, res => {
            reject(res);
        });
    });
};
cc.getColorsByCId("cmyk_uncoated");
module.exports = cc;