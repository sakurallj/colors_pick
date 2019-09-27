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
        onCDataChange() {
            this.reFormatColor();
        },
        reFormatColor() {
            let cData = this.data.cData;
            if (!cData) {
                return false;
            }
            console.log(cData);
            // for (let i in cData.list) {
            //     let item = cData.list[i];
            //     if (item.bgType == "color") {
            //         item.style = "background: " + item.bgColorValue + ";";
            //     }
            //     !!item.outBgColorValue && (item.outStyle = "background: " + item.outBgColorValue + ";");
            // }
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
                this.setData({
                    swiperDots: swiperDots,
                    rowStyle: cData.list[0].outStyle
                });
            }
        },
        swiperChange(event) {
            let that = this,
                list = that.data.cData.list,
                current = event.detail.current,
                item = list[current],
                outStyle = item.outStyle;
            console.log(list, current, item, outStyle);
            that.setData({
                swiperDotsCurrIndex: current,
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
    }
});