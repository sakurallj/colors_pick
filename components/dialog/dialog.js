let app = getApp();
let appData = app.data;
let api = app.api;
Component({
    options: {
        multipleSlots: !0
    },
    properties: {
        dialog_type: {
            type: String,
            value: "notice"
        },
        d_data: {
            type: Object,
            value: {}
        }
    },
    data: {
        isShow: !1,
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true
    },
    methods: {
        hideDialog: function() {
            this.setData({
                isShow: !1
            });
            wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#858C96",
                animation: {
                    duration: 0
                }
            });
        },
        showDialog: function() {
            console.log("showDialog");
            this.setData({
                withdrawValue: "",
                isShow: !0
            });
            wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#43464B",
                animation: {
                    duration: 0
                }
            });
            console.log("d_data", this.data.d_data);
        },
        _cancelEvent: function() {
            this.triggerEvent("cancelEvent");
        },
        _confirmEvent: function() {
            this.triggerEvent("confirmEvent");
        },
        _copyColor(e) {
            console.log("_copyColor", e);
            let value = e.currentTarget.dataset.value;
            if (!value) {
                wx.showToast({
                    title: "复制失败，请重试",
                    icon: 'none',
                    duration: 2000
                })
            } else {
                wx.setClipboardData({
                    data: value,
                    success: function(res) {
                        wx.showToast({
                            title: '颜色复制成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                });
            }
        },
        _input(e) {
            console.log(e);
            this.inputValue = e.detail.value;
        },
        _like() {
            let d_data = this.data.d_data;
            d_data.is_like = d_data.is_like == 1 ? 2 : 1;
            console.log(d_data);
            this.setData({
                d_data: d_data
            });
            api.saveOneBuiltColor(d_data.index, {
                color3: d_data.color3,
                color0: d_data.color0,
                color1: d_data.color1,
                color2: d_data.color2,
                index: d_data.index,
                name: d_data.name,
                fromShare: d_data.fromShare,
                is_like: d_data.is_like
            });
        },
        _delete() {
            let d_data = this.data.d_data,
                that = this;
            api.deleteCard(d_data, function() {
                wx.showToast({
                    title: '删除成功',
                    icon: "success",
                    duration: 2000
                });
                that.hideDialog(); console.log("_delete deleteCard");
                that.triggerEvent("deleteCard");
            })
        },
        _edit() {
            this.setData({
                sub_type: "edit"
            });

        },
        _cancelEventSub() {
            this.setData({
                sub_type: ""
            });
        },
        _confirmEventSub() {
            this.setData({
                sub_type: ""
            });
            console.log("this.inputValue ", this.inputValue);
            if (this.inputValue === 0 || this.inputValue === '0' || !!this.inputValue) {
                let d_data = this.data.d_data;
                d_data.name = this.inputValue;
                console.log(d_data);
                this.setData({
                    d_data: d_data
                });
                api.saveOneBuiltColor(d_data.index, {
                    color3: d_data.color3,
                    color0: d_data.color0,
                    color1: d_data.color1,
                    color2: d_data.color2,
                    isUGC: d_data.isUGC,
                    index: d_data.index,
                    name: d_data.name,
                    is_like: d_data.is_like,
                    fromShare: d_data.fromShare
                });
            }

        }
    }
});