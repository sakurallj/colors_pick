let that,
    app = getApp(),
    constData = app.constData,
    appData = app.data,
    services = app.services;
Page({

    data: {},

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

    }
});