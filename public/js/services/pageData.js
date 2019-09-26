import db from '../data/db';

let cc = {};

cc.collectionData = [{
    title: "经典配色",
    bgType: "color",
    bgValue: "#DFDCE3",
},
    {
        title: "Material Design规范色",
        bgType: "color",
        bgValue: "#526187",
    }, {
        title: "渐变色",
        bgType: "color",
        bgValue: "#4D2831",
    }, {
        title: "中国传统色",
        bgType: "color",
        bgValue: "#B50B1E",
    }, {
        title: "日本传统色",
        bgType: "color",
        bgValue: "#0D1130",
    }, {
        title: "Html规范色",
        bgType: "color",
        bgValue: "e62739",
    },
];

cc.pantoneGuides = {
    type: "list",
    list: db.pantoneGuides.guides
};

module.exports = cc;