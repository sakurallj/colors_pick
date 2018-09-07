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
        src: "/images/trst.jpg",
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
        }],
        movableViewColorInfo: []

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
        that.drawCanvas();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: "你要的颜色都在这里"
        }
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
                that.drawCanvas();
            }
        })
    },
    canvasId: "ch_pic_canvas",
    ctx: wx.createCanvasContext("ch_pic_canvas", this),
    drawCanvas() {
        let canvasInfo = that.data.canvasInfo,
            movableViewInfo = that.data.movableViewInfo;
        wx.getImageInfo({
            src: that.data.src,
            success: function(res) {
                console.log(res);
                let height = res.height,
                    width = res.width,
                    imgWidth = canvasInfo.width,
                    imgHeight = imgWidth * height / width,
                    y = utils.rpxToPx(imgHeight - 80 - 90),
                    ctx = that.ctx;
                canvasInfo.height = imgHeight;
                movableViewInfo[2].y = y;
                movableViewInfo[3].y = y;
                that.setData({
                    movableViewInfo: movableViewInfo,
                    canvasInfo: canvasInfo
                });
                ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
                ctx.drawImage(that.data.src, 0, 0, utils.rpxToPx(canvasInfo.width), utils.rpxToPx(canvasInfo.height));
                ctx.draw();
                for (let i = 0; i < movableViewInfo.length; i++) {
                    console.log(movableViewInfo[i]);
                    wx.canvasGetImageData({
                        canvasId: "ch_pic_canvas",
                        x: movableViewInfo[i].x,
                        y: movableViewInfo[i].y,
                        width: 1,
                        height: 1,
                        success(res) {
                            console.log("success>>>>", res.data)
                        },
                        fail: res => {
                            console.log("fail>>>>", res)
                        }
                    })
                }
            }
        });
    },
    moveGps: e => {
        console.log("moveGps", e);
        let index = e.currentTarget.dataset.index,
            movableViewColorInfo = that.data.movableViewColorInfo,
            detail = e.detail;
        wx.canvasGetImageData({
            canvasId: that.canvasId,
            x: detail.x,
            y: detail.y,
            width: 1,
            height: 1,
            success(res) {
                console.log("canvasGetImageData success", res);
                console.log(res.data[0]);
                movableViewColorInfo[index] = [
                    res.data[0], res.data[1], res.data[2], res.data[3]
                ];
                that.setData({
                    movableViewColorInfo: movableViewColorInfo
                });
            },
            fail: res => {
                console.log("canvasGetImageData fail", res);
            }
        }, that)
    }
})