// components/collectionInfo/collectionInfo.js
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

        },
        close() {
            this.triggerEvent('Close');
        },
        likeOrUnlike() {
            let cData = this.data.cData;
            cData.isLike = !cData.isLike;
            this.setData({
                cData: cData
            });
            this.triggerEvent('LikeOrUnlike', {
                id: cData.id
            });
        }
    }
})