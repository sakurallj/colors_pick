import db from '../data/db';
import interceptor from '../interceptor';
import userService from './user';

let cc = {
    defaultMyPantoneCollections: ["formula_guide_solid_coated", "formula_guide_solid_coated", "color_bridge_coated"]
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
        db.cloudDB.collection('userCollections').where({
            _openid: openId,
            type: "panton"
        }).limit(1).get().then(res => {
            console.log(res);
            let list = null;
            if (res.data.length > 0) {
                list = res.data[0].list;
            }
            if (!list) {
                list = cc.defaultMyPantoneCollections();
            }
            resolve(list);
        }, res => {
            resolve(cc.defaultMyPantoneCollections());
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
            cc.getMyPantoneCollectionIds().then(myPantoneIds => {
                resolve(cc.formatPantoneCollections(myPantoneIds, allpantoneGuides));
            }, res => {
                resolve(cc.formatPantoneCollections(cc.defaultMyPantoneCollections(), allpantoneGuides));
            })
        }, res => {
            reject(res)
        });
    });
};
module.exports = cc;