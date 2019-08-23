let default_colors = require('../..//utils/default_colors.js');
let that;
let app = getApp(),
    api = app.api,
    util = app.util;
// 在页面中定义插屏广告
let interstitialAd = null
Page({
    data: {
        showTop: false
    },
    windowHeight: 0,
    onLoad: function(opt) {
        that = this;
        console.log(opt);
        if (!!opt) {
            that.setData({
                opt: opt
            });
        }
        let info = util.getSystemInfo();
        that.windowHeight = info.windowHeight;

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-ead5b04b8df5bc7a'
        })
        interstitialAd.onLoad(() => { console.log("interstitialAd.onLoad"); })
        interstitialAd.onError((err) => { console.log("interstitialAd.onError",err); })
        interstitialAd.onClose(() => { console.log("interstitialAd.onClose" ); })


        if (interstitialAd) {
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
        }
      }

    },
    initColors() {
        api.initColors().then(colors => {
            console.log("initColors api.initColors() success colors", colors);
            that.setData({
                colors: colors
            });
        }, res => {
            wx.showModal({
                title: '初始化失败',
                content: '请确保网络畅通，然后删除小程序，再重新进入',
                showCancel: false
            })
            console.log("initColors api.initColors() fail res", res);
        });
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
    scrollTop: 0,
    onPageScroll(e) {
        let scrollTop = e.scrollTop,
            showTop = that.data.showTop;
        that.scrollTop = scrollTop;
        if (scrollTop >= that.windowHeight / 2 && !showTop) {
            that.setData({
                showTop: true
            });
        } else if (scrollTop < that.windowHeight / 2 && showTop) {
            that.setData({
                showTop: false
            });
        }
    },
    gotoTop() {
        let time = 300;
        wx.pageScrollTo({
            scrollTop: 0,
            duration: time
        });
    }
})