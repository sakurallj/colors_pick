let app = getApp();
let appData = app.data;
let api = app.apis,
    util = app.util,
    that;
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    attached: function () {
        that = this;
        that.setData({
            navHeight: util.sysInfo.navigationHeight 
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
})
