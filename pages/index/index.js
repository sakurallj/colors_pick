let that;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        setTimeout(function() {
            that.setData({
                isActive: !0
            });
            setTimeout(function() {
                that.setData({
                    isShow: false
                });
            }, 200);
        }, 1000);

    },
    onShareAppMessage: function() {

    },
    gotoCollection() {
        wx.navigateTo({
            url: '/pages/pantone/pantone',
        })
    }

})