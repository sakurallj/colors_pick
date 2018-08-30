let default_colors = require('../..//utils/default_colors.js');
let that;
Page({
    data: {

    },
    onLoad: function() {
        that = this;
        this.setData({
            colors: default_colors.colors,
            dialogData: default_colors.colors.builtInArrs[0]
        });
    },
    onShow() {
        that.dialog = that.selectComponent("#dialog");
        that.showDialog("color_comment")
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
        let item = e.currentTarget.dataset.item;
        item.index = parseInt(item.index);
        that.setData({
            dialogData: item
        });
        that.showDialog("color_detail")
    }
})