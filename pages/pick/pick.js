let that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        init_color: {
            "color3": "177E89",
            "color0": "FFC857",
            "color1": "DB3A34",
            "color2": "084C61"
        },
        src:"/images/test.jpg"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that=this;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    choosePic() {
        wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:function(res){
                console.log("choosePic",res);
                that.setData({
                    src: res.tempFilePaths[0]
                });
            }
        })
    }
})