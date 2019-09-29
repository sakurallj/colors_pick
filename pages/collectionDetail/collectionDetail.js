let that,
    app = getApp(),
    constData = app.constData,
    appData = app.data,
    util = app.util,
    services = app.services;
Page({

    data: {
        navHeight: util.sysInfo.navigationHeight,
        leftGap: util.sysInfo.leftGap
    },

    onLoad: function(options) {
        that = this;
        that.cId = options.cId;
        that.dataType = options.dataType;
        that.getData();
    },
    getData() {
        if (that.dataType === constData.DT_PANTONE) {
            services.pantone.getDetailById(that.cId).then(res => {
                that.setData({
                    cData: res
                });
            }, res => {});
        }

    },
    onShow: function() {

    },

    onShareAppMessage: function() {

    },
    goBack: function () {
        wx.navigateBack({});
    }
});