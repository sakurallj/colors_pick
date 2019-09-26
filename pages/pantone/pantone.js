import pantone from "../../public/js/services/pantone";

let that;
let app = getApp();
let appData = app.data;
let services = app.services;
Page({

    data: {
        cData: services.pageData.pantoneGuides,
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000
    },

    onLoad: function () {
        that = this;
        that.getData();
    },
    getData() {
        wx.showLoading({
            title: "加载中"
        });
        services.pantone.getMyPantoneCollections().then(res => {
            wx.hideLoading();
            that.setData({
                myCData: res
            });
        }, res => {
            wx.hideLoading();
        });
        services.pantone.getPantoneGuides().then(res => {
            wx.hideLoading();
            that.setData({
                cData: res
            });
        }, res => {
            wx.hideLoading();

        });
    },

    onShow: function () {

    },

    onShareAppMessage: function () {

    }
});