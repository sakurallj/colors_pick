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
        navTitle: {
            type: String,
            value: ''
        },
        navType: {
            type: String,
            value: ''
        },
        navBgStyle:{
            type: String,
            value: ''
        },
        mustUpdate: { //随机字符串 
            type: String,
            value: '',
            observer: function(newData, oldData) {
                this.doUpdate(newData, oldData);
            }
        },
    },
    attached: function() {
        that = this;
        that.setData({
            boxMTop: util.menuButtonBoundingClientRect.top,
            boxMLeft: util.sysInfo.screenWidth - util.menuButtonBoundingClientRect.right,
            boxWidth: util.menuButtonBoundingClientRect.height,
            boxHeight: util.menuButtonBoundingClientRect.height,
            imageWidth: util.menuButtonBoundingClientRect.height * 0.5 - 3,
            imageHeight: util.menuButtonBoundingClientRect.height * 0.5 - 3,
            textFontSize: util.menuButtonBoundingClientRect.height * 0.5,
            navHeight: util.sysInfo.navigationHeight,
            circleImageWidth: util.menuButtonBoundingClientRect.height * 0.6,
            circleImageHeight: util.menuButtonBoundingClientRect.height * 0.6,
        });
        console.log("getCurrentPages",getCurrentPages());
    },
    data: {
        isShowHome: false
    },

    methods: {
        doUpdate(newData, oldData) {
            console.log("navbar doUpdate appData", appData);
            this.setData({
                isShowHome: !!appData && !!appData.navData ? !!appData.navData.showHome : false
            });
        },
        goBack: function() {
            let eventDetail = {} // detail对象，提供给事件监听函数
            let eventOption = {} // 触发事件的选项
            this.triggerEvent('GoBack', eventDetail, eventOption)
        },
        backHome: function() {
            let eventDetail = {} // detail对象，提供给事件监听函数
            let eventOption = {} // 触发事件的选项
            this.triggerEvent('BackHome', eventDetail, eventOption)
        },
    }
})