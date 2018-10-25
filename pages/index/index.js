let default_colors = require('../..//utils/default_colors.js');
let that;
let app = getApp(),
    api = app.api;
Page({
    data: {

    },
    onLoad: function(opt) {
        that = this;
        console.log(opt);
        if (!!opt) {
            that.setData({
                opt: opt
            });
        }
    },
    initColors() {
        let colors = wx.getStorageSync("colors"),
            that = this;
        if (colors) {
            this.setData({
                colors: colors
            });
        } else {
            api.getMyColorFromCDB().then(res => {
                let data = res[0];
                if (!data || !data.builtInArrs) {
                    that.setColorsToDefaultColors();
                }
                colors = {
                    builtInArrs: data.builtInArrs,
                    UGCArrs: !data.UGCArrs ? [] : data.UGCArrs
                };
                wx.setStorageSync("colors", colors);
                wx.setStorageSync("color_id", data._id);
                that.setData({
                    colors: colors
                });
            }, res => {
                that.setColorsToDefaultColors();
            });
        }
    },
    setColorsToDefaultColors() {
        let colors = default_colors.colors;
        this.setData({
            colors: colors
        });
        wx.setStorageSync("colors", colors);
    },
    onShow() {
        that.initColors();
        that.dialog = that.selectComponent("#dialog");
        // this.setData({
        //     dialogData: default_colors.colors.builtInArrs[0]
        // });
        // that.showDialog("color_detail")
        let opt = that.data.opt;
        that.doLoadOpt(opt);
    },
    onHide() {
        this.hiddenDialog();
    },
    doLoadOpt(opt) {
        if (!opt) {
            return false;
        }
        if (!opt.item || typeof opt.item != "string") {
            return false;
        }
        let item = JSON.parse(opt.item);
        if (!!item) {
            opt.item = null;
            this.setData({
                dialogData: item,
                opt: opt
            });
            that.showDialog("color_detail")
        }
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
        let item = e.currentTarget.dataset.item;
        item.index = parseInt(item.index);
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