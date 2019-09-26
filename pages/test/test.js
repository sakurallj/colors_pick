let that;
Page({
    data: {
        swiperList: [{ //除了1，2之外，其它的swpClass都是swp-rightNo
            aurl: "../start/start",
            swpClass: "swp-center",
            time: "2018年3月下11",
            bname: "2018全球十大突破技术11",
            imgsrc: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
            style: "background:#DFDCE3"
        }, {
            aurl: "#",
            swpClass: "swp-right",
            time: "2018年3月下22",
            bname: "2018全球十大突破技术22",
            imgsrc: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
            style: "background:#526187"
        }, {
            aurl: "#",
            swpClass: "swp-rightNo",
            time: "2018年3月下33",
            bname: "2018全球十大突破技术33",
            imgsrc: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640",
            style: "background:#4D2831"
        }, {
            aurl: "#",
            swpClass: "swp-rightNo",
            time: "2018年3月下33",
            bname: "2018全球十大突破技术33",
            imgsrc: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640",
            style: "background:#B50B1E"
        }, {
            aurl: "#",
            swpClass: "swp-rightNo",
            time: "2018年3月下33",
            bname: "2018全球十大突破技术33",
            imgsrc: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640",
            style: "background:#e62739"
        }]
    },
    onLoad() {
        that = this;
    },
    swpBtn: function(e) {
        var swp = this.data.swiperList;
        var max = swp.length;
        var idx = e.currentTarget.dataset.index;
        var prev = swp[idx - 1]; //前一个
        var next = swp[idx + 1]; //后一个
        var curView = swp[idx]; //当前
        if (curView.swpClass === 'swp-center') { //如果当前是在中间的，即可跳转
            wx.navigateTo({
                url: curView.aurl,
            })
        }

        if (prev) { //如果当前的前面有
            if (next) { //当前的后面有
                next.swpClass = "swp-right";
            }
            prev.swpClass = "swp-left";
            curView.swpClass = "swp-center";
            for (var i = 0; i < idx; i++) { //当前前一个的前面所有
                swp[i].swpClass = 'swp-leftNo'
            }
        }
        if (next) { //如果当前的后面有
            if (prev) { //当前的前面有
                prev.swpClass = "swp-left";
            }
            curView.swpClass = "swp-center";
            next.swpClass = "swp-right";
            for (var i = (idx + 2); i < max; i++) { //当前后一个的后面所有
                swp[i].swpClass = 'swp-rightNo'
            }
        } else {
            prev.swpClass = "swp-left";
            curView.swpClass = "swp-center";
        }

        this.setData({
            swiperList: swp
        })
    },
    preTouche: null,
    lastGayX: 0,
    touchMove(event) {
        if (that.preTouche) {
            let changedTouche = event.changedTouches[0],
                preX = that.preTouche.pageX,
                currX = changedTouche.pageX,
                gapX = preX - currX;
            if (gapX > that.lastGayX) {
                console.log("左");
            } else {
                console.log("右");
            }
            that.preTouches = changedTouche;
            that.lastGayX = gapX;
        } else {
            that.preTouche = event.changedTouches[0];
        }
    },
    touchEnd() {
        //清理数据
        that.preTouche = null;
        that.lastGayX = 0;
    }
})