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
            "color2": "084C61",
            "index": -1
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
        that.dialog = that.selectComponent("#dialog");
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
                setTimeout(function() {
                    that.initPointImageColor(0);
                }, 500);
            }
        });
    },
    initPointImageColor(index) {
        let movableViewInfo = that.data.movableViewInfo,
            len = movableViewInfo.length,
            movableViewColorInfo = that.data.movableViewColorInfo;
        if (index > len) {
            console.log("big");
            return false;
        }
        console.log(movableViewInfo[index].x - utils.rpxToPx(90 / 2), movableViewInfo[index].y - utils.rpxToPx(90));
        wx.canvasGetImageData({
            canvasId: "ch_pic_canvas",
            x: movableViewInfo[index].x + utils.rpxToPx(90 / 2),
            y: movableViewInfo[index].y + utils.rpxToPx(90),
            width: 1,
            height: 1,
            success(res) {
                console.log(index, "success>>index>>", index, res);
                that.updateColor(index, res.data);
                that.initPointImageColor(++index);
            },
            fail: res => {
                console.log("fail>>index>>", index, res)
            }
        })
    },
    moveGps: e => {
        console.log("moveGps>", e)
        let index = e.currentTarget.dataset.index,
            movableViewColorInfo = that.data.movableViewColorInfo,
            detail = e.detail,
            init_color = that.data.init_color;
        wx.canvasGetImageData({
            canvasId: that.canvasId,
            x: detail.x + utils.rpxToPx(90 / 2),
            y: detail.y + utils.rpxToPx(90),
            width: 1,
            height: 1,
            success(res) {
                console.log("moveGps canvasGetImageData success", res);
                that.updateColor(index, res.data);
            },
            fail: res => {
                console.log("moveGps canvasGetImageData fail", res);
            }
        }, that)
    },
    updateColor(index, colors) {
        let
            movableViewColorInfo = that.data.movableViewColorInfo,
            init_color = that.data.init_color;
        movableViewColorInfo[index] = [
            colors[0], colors[1], colors[2]
        ];
        let hex = utils.rgbToHex("rgb(" + movableViewColorInfo[index].join(",") + ")");
        init_color["color" + index] = hex;
        that.setData({
            init_color: init_color,
            movableViewColorInfo: movableViewColorInfo
        });
    },
    showDialog(dialog_type) {
        this.setData({
            dialog_type: dialog_type
        });
        this.dialog.showDialog();
    },
    hiddenDialog: function() {
        this.dialog.hideDialog();
    },
    cancelEvent() {
        this.hiddenDialog();
    },
    chooseItem(e) {
        console.log(e);
        let item = e.currentTarget.dataset.item; console.log(item);
        item.index = parseInt(item.index);
        item.copyStr = "色卡 " + (!!item.name ? item.name : "No." + (item.index + 1)) + "\n" + "[1]:#" + item.color0 + "\n" + "[2]:#" + item.color1 + "\n" + "[3]:#" + item.color2 + "\n" + "[4]:#" + item.color3;
        that.setData({
            dialogData: item
        });
        that.showDialog("color_detail")
    },
    addCard(){
        
    }
})