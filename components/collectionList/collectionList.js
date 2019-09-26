Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cData: {
            type: Object,
            value: {},
            observer: function (newData, oldData) {
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
    data: {},

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
            for (let i in cData.list) {
                let item = cData.list[i];
                if (item.bgType == "color") {
                    item.style = "background: " + item.bgColorValue + ";";
                } 
                !!item.outBgColorValue && (item.outStyle = "background: " + item.outBgColorValue + ";");
            }
            this.setData({
                cData: cData
            });
        }
    }
})