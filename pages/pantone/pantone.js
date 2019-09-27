import pantone from "../../public/js/services/pantone";

let that;
let app = getApp();
let appData = app.data;
let services = app.services;
Page({

    data: {
        cData: {}
    },

    onLoad: function() {
        that = this;
        that.setData({
            pages: getCurrentPages()
        });
        that.getData();
    },
    getData() {
        wx.showLoading({
            title: "加载中"
        });
        services.pantone.getPantonePageData().then(res => {
            wx.hideLoading();
            that.setData({
                cData: res
            });
        }, res => {
            wx.hideLoading();
        });

    },

    onShow: function() {

    },
    onPageScroll: function(event) {
        that.setData({
            cScrollTop: event.scrollTop
        });
    },
    onShareAppMessage: function() {

    }
});