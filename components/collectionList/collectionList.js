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
    },
    ready() {
        console.log(this.data.cData);
        this.reFormatColor();
    },
    /**
     * 组件的初始数据
     */
    data: {
        indicatorDots: true,
        autoplay: false,
        interval: 3000,
        duration: 1000,
        swiperCurrIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCDataChange(newData, oldData) {
            this.reFormatColor(newData, oldData);
        },
        reFormatColor(newData, oldData) {
            let cData = newData;
            if (!cData) {
                return false;
            }
            this.setData({
                cData: cData
            });
            if (cData.layout == "swiper") {
                let swiperDots = {
                    list: [],
                    indicatorColor: "rgba(255, 255, 255, .3)",
                    indicatorActiveColor: '#ffffff'
                };
                for (let i in cData.list) {
                    swiperDots.list[i] = i;
                }
                let swiperCurrentIndex = this.data.swiperCurrentIndex,
                    outStyle = cData.list[0].outStyle;
                swiperCurrentIndex = !swiperCurrentIndex ? 0 : swiperCurrentIndex;
                let i = swiperCurrentIndex;
                for (; i >= 0; i--) {
                    if (!!cData.list[i]) {
                        break;
                    }
                }
                let item = cData.list[i];
                outStyle = item.outStyle;
                swiperCurrentIndex = i;
                console.log("reFormatColor", outStyle, swiperCurrentIndex);
                this.setData({
                    swiperDots: swiperDots,
                    rowStyle: outStyle,
                    swiperCurrentIndex: swiperCurrentIndex
                });
                this.triggerEvent('SwiperChange', item);
            }
        },
        swiperChange(event) {
            let that = this,
                list = that.data.cData.list,
                current = event.detail.current,
                item = list[current],
                outStyle = item.outStyle;
            that.setData({
                swiperCurrentIndex: current,
                rowStyle: outStyle
            });
            this.triggerEvent('SwiperChange', item);
        },
        showInfo(event) {
            this.triggerEvent('ShowAlbumInfo', event.detail);
        },
        likeOrUnlike(event) {
            this.triggerEvent('LikeOrUnlike', event.detail);
        },
        showDetail(event){
            this.triggerEvent('ShowDetail', event.detail);
        }
    }
});