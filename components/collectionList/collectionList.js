let that;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cData: {
            type: Object,
            value: []
        },
    },
    ready() {
        console.log(this);
        that = this;
        that.reFormatColor();
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
        reFormatColor() {
            let cData = that.data.cData;
            for (let i in cData.list) {
                let item = cData.list[i];
                if (item.bgType == "color") {
                    item.style = "background: " + item.mainColorRGB + ";"
                }
            }
            that.setData({
                cData: cData
            });
        }
    }
})