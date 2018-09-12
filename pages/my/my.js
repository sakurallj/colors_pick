let default_colors = require('../..//utils/default_colors.js');
let that;
Page({
    data: {

    },
    onLoad: function() {
        that = this;
    },
    initColors() {
        let colors = wx.getStorageSync("colors");
        if (!colors) {
            colors = default_colors.colors;
            wx.setStorageSync("colors", colors);
        }
        let i = 0,
            len = colors.builtInArrs.length,
            has_like = false;
        for (; i < len; i++) {
            if (colors.builtInArrs[i].is_like == 1) {
                has_like = true;
                break;
            }
        }
        colors.UGCArrs = colors.UGCArrs.reverse()
        this.setData({
            has_like: has_like,
            colors: colors
        });
    },
    onShow() {
        that.initColors();
        that.dialog = that.selectComponent("#dialog");
        // this.setData({
        //     dialogData: default_colors.colors.builtInArrs[0]
        // });
        // that.showDialog("color_detail")
    },
    deleteCard() {
        console.log("deleteCard");
        that.initColors();
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
        that.initColors();
        this.hiddenDialog();
    },
    chooseItem(e) {
        console.log(e);
        let item = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index, colors = that.data.colors, UGCArrs = colors.UGCArrs, len = UGCArrs.length;
        item.index = parseInt(item.index);
        item.data_index = len - 1 - index;
        item.copyStr = "色卡 " + (!!item.name ? item.name : "No." + (item.index + 1)) + "\n" + "[1]:#" + item.color0 + "\n" + "[2]:#" + item.color1 + "\n" + "[3]:#" + item.color2 + "\n" + "[4]:#" + item.color3;
        that.setData({
            dialogData: item
        });
        that.showDialog("color_detail")
    },
    onShareAppMessage: function(event) {
        return app.createShareAppMessageParams(event);
    },
})