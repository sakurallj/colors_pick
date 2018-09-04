let that;
let utils = require('../..//utils/util.js');
utils = utils.utils;
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
        src: "",
        pickImgInfo: {
            src: "/images/gps.png",
            width: utils.rpxToPx(90),
            height: utils.rpxToPx(90),
        },
        canvasInfo: {
            width: 630,
            height: 394
        },
        movableViewInfo: [{
            x: utils.rpxToPx(80),
            y: utils.rpxToPx(80),
        }, {
            x: utils.rpxToPx(440),
            y: utils.rpxToPx(80),
        }, {
            x: utils.rpxToPx(80),
            y: 0,
        }, {
            x: utils.rpxToPx(440),
            y: 0,
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
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
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                console.log("choosePic", res);
                that.setData({
                    src: res.tempFilePaths[0]
                });
                let canvasInfo = that.data.canvasInfo,
                    ctx = wx.createCanvasContext("ch_pic_canvas", this),
                    movableViewInfo = that.data.movableViewInfo;
                wx.getImageInfo({
                    src: that.data.src,
                    success: function(res) {
                        console.log(res);
                        let height = res.height,
                            width = res.width,
                            imgWidth = canvasInfo.width,
                            imgHeight = imgWidth * height / width,
                            y = utils.rpxToPx(imgHeight - 80 - 90);
                        canvasInfo.height = imgHeight;
                        movableViewInfo[2].y = y;
                        movableViewInfo[3].y = y;
                        ctx.drawImage(that.data.src, 0, 0, utils.rpxToPx(imgWidth), utils.rpxToPx(imgHeight));
                        //绘制取色点
                        for (let i = 0; i < movableViewInfo.length; i++) {
                            ctx.drawImage(that.data.pickImgInfo.src, movableViewInfo[i].x, movableViewInfo[i].y, that.data.pickImgInfo.width, that.data.pickImgInfo.height);
                        }
                        ctx.draw();
                        that.setData({
                            movableViewInfo: movableViewInfo,
                            canvasInfo: canvasInfo
                        });

                    }
                });
            }
        })
    },
    reDrawCanvas() {
        let canvasInfo = that.data.canvasInfo,
            ctx = wx.createCanvasContext("ch_pic_canvas", this),
            movableViewInfo = that.data.movableViewInfo;
        ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
    },
    moveGps: e => {
        console.log("moveGps", e);
        wx.canvasGetImageData({
            canvasId: 'ch_pic_canvas',
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            success(res) {
                console.log("canvasGetImageData success", res);
                console.log(res.data[0]);
            },
            fail: res => {
                console.log("canvasGetImageData fail", res);
            }
        }, that)
    }
})