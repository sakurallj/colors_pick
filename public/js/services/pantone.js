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
        resolve({
            layout: "list",
            list: db.pantoneGuides.guides
        });
    });
};

/**
 * 获得我收藏的潘通指南
 * @type {function(): Promise<any>}
 */
cc.getMyPantoneCollections = interceptor.waitOpenIdInterceptor(() => {
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
            let data = cc.formatMyPantoneCollections(list);
            resolve(data);
        }, res => {
            let data = cc.formatMyPantoneCollections(cc.defaultMyPantoneCollections());
            resolve(data);
        })
    });
});
/**
 * 处理我收藏的潘通指南
 * @param list
 * @returns {{layout: string, outBgColorValue: string, tip: string, title: string, bgColorValue: string}[]}
 */
cc.formatMyPantoneCollections = (list) => {
    let rtnData = [
        {
            layout: "tip",
            title: "试着\n在这里寻找您的色彩灵感吧！",
            tip: "您可以轻触各个色集上的心形按钮来编辑您色彩集内的指南",
            outBgColorValue: "#2F244C",
            bgColorValue: "#443C5E", 
            bgType :"color"
        }
    ];
    let pantoneGuides = db.pantoneGuides.guides;
    for (let i in list) {
        for (let pI in pantoneGuides) {
            if (pantoneGuides[pI].id === list[i]) {
                rtnData[rtnData.length] = pantoneGuides[pI];
                break;
            }
        }
    }
    return {
        layout: "swiper",
        list: rtnData
    };
};

module.exports = cc;