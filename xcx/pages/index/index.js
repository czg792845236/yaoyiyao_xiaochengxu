//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arr:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  //------------------------------------------------------
  //上面的内容是hello word的，不用管
  // 链接socket
    wx.connectSocket({
      url: 'ws://192.168.1.198:8080',
    });
    var self = this;
    // 用来存放上一次的值
    var lastX = 0;
    // WebSocket 连接打开事件
    wx.onSocketOpen(function(){
      //监听手机的x,y,z的值
      wx.onAccelerometerChange(function (res) {
        // 对比当前手机倾斜的x的值和上次倾斜的绝对值，如果大于0.6了，就说明手机摇了一次
          if(Math.abs(res.x - lastX) > 0.6){
            wx.showToast({
              title: '成功'
            });
            // 向服务器发送信息
            wx.sendSocketMessage({
              // 发送给服务器的data数据
              data: JSON.stringify({
                // 发送给服务器用户的头像和昵称
                nickName:self.data.userInfo.nickName,
                avatarUrl : self.data.userInfo.avatarUrl
              })
            })
          }
          // 摇完一次之后让lastX等于当前这次的x的值
          lastX = res.x;

      })
    });
// 接收服务器返回的数据
    wx.onSocketMessage(function(res){
      console.log(res)
      // 因为接收回来的是字符串，所以要转JSON
      var obj = JSON.parse(res.data);
      var arr = obj.score_arr;
      // 对将比服务器返回来的n的值排序，n的值大的排前面。
      arr.sort((a,b)=>{
        return b.n - a.n
      })
      // 更改data值
      self.setData({
        arr
      })
    })
  },
  // 下面的内容是hello word的，不用管
  //--------------------------------------------------------
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
