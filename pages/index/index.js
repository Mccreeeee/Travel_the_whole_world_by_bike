var myUtils = require("../../utils/myUtils.js");

Page({
  data: {
    //用于初始地图的真定位
    log: 0,
    lat: 0,
    //控件组
    controls: [],
    //标记点组
    markers: []
  },
  /**
   * 生命周期函数--监听页面的加载
   */
  //首次加载页面时（页面渲染完成前）调用
  onLoad: function () {
    var that = this;
    wx.getLocation({
      //使用gcj02国测局坐标系
      type: 'gcj02',
      success: function(res) {
        that.setData({
          log: res.longitude,
          lat: res.latitude,
        });
        myUtils.findNear(res.longitude, res.latitude, that);
      },
    });
    
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          //设置控件
          controls: [
            //一个控件就是一个json
            //扫码骑车
            {
              id: 1,
              iconPath: "/images/qrcode.png",
              position: {
                width: 100,
                height: 40,
                left: res.windowWidth / 2 - 50,
                top: res.windowHeight - 60
              },
              clickable: true
            },
            //充值按钮
            {
              id: 2,
              iconPath: "/images/pay.png",
              position: {
                width: 40,
                height: 40,
                left: res.windowWidth - 45,
                top: res.windowHeight - 100
              },
              clickable: true
            },
            //报修按钮
            {
              id: 3,
              iconPath: "/images/warn.png",
              position:{
                width: 35,
                height: 35,
                left: res.windowWidth - 42,
                top: res.windowHeight - 60
              },
              clickable: true
            },
            //定位按钮
            {
              id: 4,
              iconPath: "/images/local.png",
              position:{
                width: 40,
                height: 40,
                left: 10,
                top: res.windowHeight - 60
              },
              clickable: true
            },
            //中心点的位置
            {
              id: 5,
              iconPath: "/images/location.png",
              position: {
                width: 20,
                height: 35,
                left: res.windowWidth / 2 - 11,
                top: res.windowHeight / 2 - 35
              },
              clickable: true
            },
            //添加车辆
            {
              id: 6,
              iconPath: "/images/add.png",
              position: {
                width: 35,
                height: 35
              },
              clickable: true
            }
          ]
        })
      },
    })
   },
   /**
   * 生命周期函数--页面首次加载完成的时候执行
   */
   onReady: function(){
     //创建地图上下文
     this.mapCtx = wx.createMapContext("myMap", this)
   },
  /**
   * 控件被点击事件
   */
  controlTap: function (e){
      var cid = e.controlId;
      switch(cid) {
        //跳转到注册页面
        case 1:{
          var status = myUtils.get("status");
          //为0代表未登录，需要跳转
          if(status == 0) {
            wx.navigateTo({
              url: '../register/register',
            });
          } else if(status == 1) {
            //为1代表已登录但需要交押金
            wx.navigateTo({
              url: '../deposit/deposit',
            });
          } else if(status == 2) {
            //为2代表已交押金但需要实名认证
            wx.navigateTo({
              url: '../identify/identify',
            });
          }
          break;
        }
        //定位功能
        case 4: {
          this.mapCtx.moveToLocation();
          break;
        }
        //添加单车
        case 6: {
          var that = this;
            //var bikes = this.data.markers;
          this.mapCtx.getCenterLocation({
            success(res) {
              var bikeLog = res.longitude;
              var bikeLat = res.latitude;
              // bikes.push(
              //   {
              //     width: 35,
              //     height: 40,
              //     iconPath: "/images/bike.png",
              //     longitude: bikeLog,
              //     latitude: bikeLat
              //   }
              // );
              // //使用setData方法将数据变化应用到视图，不然会视图与数据不一致
              // that.setData({
              //   markers: bikes
              // });
              //添加单车发送数据到后台（SpringBoot）
              wx.request({
                url: 'http://localhost:8080/bike/addABike',
                method: 'POST',
                data: {
                  "location": [bikeLog, bikeLat],
                  "status": 0
                },
                success: function(resp) {
                  myUtils.findNear(bikeLog, bikeLat, that);
                }
              });
            }
          });
          break;
        }
      }
    },
    /**
     * 视野变化触发的事件
     */
    regionChange: function(e) {
      var that = this;
      var eType = e.type;
      if(eType == "end") {
        this.mapCtx.getCenterLocation({
          success: function(res) {
            myUtils.findNear(res.longitude, res.latitude, that);
          }
        })
      }
    }
})
