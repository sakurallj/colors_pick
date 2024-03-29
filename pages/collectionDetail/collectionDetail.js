let that,
    app = getApp(),
    constData = app.constData,
    appData = app.data,
    util = app.util,
    services = app.services;
Page({

    data: {
        navHeight: util.sysInfo.navigationHeight,
        leftGap: util.sysInfo.leftGap,
        currRowNumber: 0
    },

    onLoad: function(options) {
        that = this;
        that.cId = options.cId;
        that.dataType = options.dataType;
        that.getData();
    },
    getData() {
        if (that.dataType === constData.DT_PANTONE) {
            services.pantone.getDetailById(that.cId).then(res => {
                let cellInfo = util.getCellsWidthAndHeight(res.columnsPerPage);

                for (let index in res.list) {
                    res.list[index].isRowEnd = (res.columnsPerPage == 1 || index % res.columnsPerPage == (res.columnsPerPage - 1) || res.list.length - 1 == index);
                    res.list[index].rowNumber = parseInt(index / res.columnsPerPage) + 1;
                    res.list[index].cellInfoIndex = index % res.columnsPerPage;
                }
                let cDataInfo = util.copyObject(res, ["list"]);
                let item = res.list[4];
                that.setData({
                    cellInfo: cellInfo,
                    cData: res,
                    cDataInfo: cDataInfo,

                    currCellInfo: item,
                    currRowNumber: item.rowNumber
                });
            }, res => {});
        }

    },
    onShow: function() {

    },

    onShareAppMessage: function() {

    },
    goBack: function() {
        wx.navigateBack({});
    },
    showAlbumInfo() {
        let cDataInfo = that.data.cDataInfo;
        cDataInfo.isShowAlbumInfo = true;
        this.setData({
            cDataInfo: cDataInfo
        });
    },
    closeInfo() {
        let cDataInfo = that.data.cDataInfo;
        cDataInfo.isShowAlbumInfo = false;
        that.setData({
            cDataInfo: cDataInfo
        });
    },
    likeOrUnlike() {
        let cDataInfo = that.data.cDataInfo;
        services.pantone.saveLike(cDataInfo.id).then(res => {
            cDataInfo.isLike = !cDataInfo.isLike;
            that.setData({
                cDataInfo: cDataInfo
            });
            wx.hideLoading();
        }, res => {
            wx.hideLoading();
        });
    },
    showOrCloseCellInfo(event) {
        console.log(event);
        let item = event.currentTarget.dataset.item,
            currRowNumber = that.data.currRowNumber;
        if (!!currRowNumber) {
            that.setData({
                currRowNumber: 0
            });
        } else {
            that.setData({
                currCellInfo: item,
                currRowNumber: item.rowNumber
            });
        }
    }
});