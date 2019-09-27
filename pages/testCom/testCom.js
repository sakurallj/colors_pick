let that;
let app = getApp();
let appData = app.data;
let services = app.services;
Page({

  
    data: {
        cData: {

        }
    },

    onLoad: function(options) {
        that=this;
        that.getData();
    },
    getData() {
        wx.showLoading({
            title: "加载中"
        });
        services.pantone.getPantonePageData().then(res => {
            wx.hideLoading();

            that.setData({
                cData: res.allGuides.list[6],
                 
            });
        }, res => {
            wx.hideLoading();
        });

    },
    onShareAppMessage: function() {

    }, gotoCollection() {
        wx.navigateTo({
            url: '/pages/index/index',
        })
    }

})