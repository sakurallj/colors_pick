// components/swiperDots/swiperDots.js
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
        cCurrIndex: {
            type: Number,
            value: 0 
        },
        cMaxWidth: {
            type: Number,
            value: 750,
            observer: function (newData, oldData) {
                this.onMaxWidthChange(newData, oldData);
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCDataChange(newData, oldData) {
            if (!newData || !newData.list || newData.list.length <= 0) {
                return false;
            }
            console.log(newData);
            newData.style = "background: " + (!!newData.indicatorColor ? newData.indicatorColor : "rgba(0, 0, 0, .3)") + ";"
            this.setData({
                cData: newData,
                style: "background: " + (!!newData.indicatorColor ? newData.indicatorColor : "rgba(0, 0, 0, .3)") + ";",
                activeStyle: "background: " + (!!newData.indicatorActiveColor ? newData.indicatorActiveColor : "#000000") + ";"
            });
        },
        onMaxWidthChange(newMaxWidth, oldMaxWidth){

        }
    }
})