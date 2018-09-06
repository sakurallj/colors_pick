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
        src: "http://img5.imgtn.bdimg.com/it/u=1177527485,4257251962&fm=26&gp=0.jpg",
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
                    y = utils.rpxToPx(imgHeight - 80 - 90);
                canvasInfo.height = imgHeight;
                movableViewInfo[2].y = y;
                movableViewInfo[3].y = y;
                that.setData({
                    movableViewInfo: movableViewInfo,
                    canvasInfo: canvasInfo
                });
                that.reDrawCanvas()

            }
        });
    },
    ctx: wx.createCanvasContext("ch_pic_canvas", this),
    reDrawCanvas() {
        let canvasInfo = that.data.canvasInfo,
            ctx = that.ctx,
            movableViewInfo = that.data.movableViewInfo;
        ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
        ctx.drawImage(that.data.src, 0, 0, utils.rpxToPx(canvasInfo.width), utils.rpxToPx(canvasInfo.height));
        //绘制取色点
        for (let i = 0; i < movableViewInfo.length; i++) {
            ctx.drawImage(that.data.pickImgInfo.src, movableViewInfo[i].x, movableViewInfo[i].y, that.data.pickImgInfo.width, that.data.pickImgInfo.height);
        }
        ctx.draw();
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
    },
    touchstart(e) {
        console.log("touchstart", e);
    },
    touchmove(e) {
        console.log("touchmove", e);
        let movableViewInfo = that.data.movableViewInfo,
            position = e.touches[0];
        movableViewInfo[0].x = position.x;
        movableViewInfo[0].y = position.y;
        that.drawCanvas();
    },
    touchend(e) {
        console.log("touchend", e);
    }
})