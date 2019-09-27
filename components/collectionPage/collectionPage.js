let app = getApp();
let appData = app.data;
let api = app.apis,
    util = app.util;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cData: {
            type: Object,
            value: {},
            observer: function(newData, oldData) {
                this.onCDataChange(newData, oldData);
            }
        },
        cScrollTop: {
            type: Number,
            value: 0,
            observer: function(newData, oldData) {
                this.onScrollTopChange(newData, oldData);
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCDataChange(newData, oldData) {
            let data = {},
                that = this;
            if (!newData) {
                return false;
            }
            if (!!newData.myGuides) {
                data.myGuides = newData.myGuides;
                data.swiperColOutStyle = "background: " + data.myGuides.list[0].outBgColorValue + ";";
            }
            if (!!newData.allGuides) {
                data.allGuides = newData.allGuides;
            }
            this.setData(data);

            if (!!data.myGuides) {
                const query = this.createSelectorQuery()
                query.select('#swiper_collection_list').boundingClientRect()
                query.exec(function(res) {
                    if (!!res && !!res[0] && res[0].height) {
                        that.setData({
                            swiperHeight: res[0].height
                        });
                    }
                })
            }

        },

        onScrollTopChange(newScrollTop, oldScrollTop) {
            let swiperHeight = this.data.swiperHeight;
            if (swiperHeight > 0 && swiperHeight - newScrollTop <= util.sysInfo.navigationHeight) {
                this.setData({
                    navBgStyle: this.data.swiperColOutStyle
                });
            } else {
                !!this.data.navBgStyle && this.setData({
                    navBgStyle: ""
                });
            }
        },
        swiperColChange(event) {
            let item = event.detail;
            this.setData({
                swiperColOutStyle: item.outStyle
            });
        },
        showAlbumInfo(event) {
            let item = event.detail;
            console.log(item);
            item.isShowAlbumInfo = true;
            this.setData({
                colInfo: item
            });
        },
        closeInfo() {
            this.setData({
                colInfo: ""
            });
        }
    }
})