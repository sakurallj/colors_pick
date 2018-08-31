//app.js
App({
  onLaunch: function () {
   
  },
  globalData: {
    userInfo: null
  },
  api:{
      saveOneBuiltColor(index,item){
          let colors = wx.getStorageSync("colors");
          if (!colors || !colors.builtInArrs[index]) {
             wx.showToast({
                 title: '保存失败',
                 duration:1000
             })
          }
          colors.builtInArrs[index] = item;
          wx.setStorageSync("colors", colors);
      }
  }
})