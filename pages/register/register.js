// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["86", "80", "84", "87", "90"],
    countryCodeIndex: 0,
    phoneNum: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 输入电话号码时的事件，在输入的时候触发事件
   */
  inputPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    });
  },

  /**
   * 点击获取验证码时的事件
   */
  genVerifyCode: function () {
    //获取当前选择的国家索引
    var index = this.data.countryCodeIndex;
    //获取当前选择的国家代码
    var countryCode = this.data.countryCodes[index];
    //获取当前输入的手机号
    var phoneNum = this.data.phoneNum;
    //正则表达式匹配纯数字
    var pattern = /^\d+$/
    //不为空则发送
    if(pattern.test(phoneNum)) {
    //向后台发送请求，请求获取验证码
      wx.request({
        url: "http://localhost:8080/user/genCode",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        //使用get方式传递JSON
        method: "POST",
        data: {
          "countryCode": countryCode,
          "phoneNum": phoneNum
        },
        success: function(res) {
          wx.showToast({
            title: "验证码已成功发送！",
            iconL: "success",
            duration: 2000
          })
        }
      });
    }else {
      wx.showToast({
        title: "获取验证码失败！",
        icon: "none",
        duration: 2000
      });
    }
  },

  /**
   * 滑动选择国家代码并设置国家代码，在点击确定后触发事件
   */
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    });
  },

  /**
   * 提交验证码验证事件，在点击确定后触发事件
   */
  formSubmit: function(e) {
    var phoneNum = e.detail.value.phoneNum;
    var verifyCode = e.detail.value.verifyCode;
    wx.request({
      url: "http://localhost:8080/user/verify",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        "phoneNum": phoneNum,
        "verifyCode": verifyCode
      },
      success: function(res) {
        //校验成功
        if(res.data) {
          //保存到MongoDB中，同时跳转到押金充值页面
          wx.request({
            url: "http://localhost:8080/user/reg",
            method: "POST",
            data: {
              "phoneNum": phoneNum,
              "regDate": new Date(),
              "status": 1
            },
            success: function(res) {
              //用户信息保存成功
              console.log(res);
              //存储状态到内存中
              getApp().globalData.status = res.data;
              //存储手机号到内存中
              getApp().globalData.phoneNum = phoneNum;
              //存储状态到SD卡中
              wx.setStorageSync("status", res.data);
              //存储手机号到SD卡中
              wx.setStorageSync("phoneNum", phoneNum);
              //记录用户登录状态，0为未注册，1为已注册需交押金，2为已交实名认证需实名认证，3为已通过
              if(res.data == 1) {
                //跳转交押金页面
                wx.navigateTo({
                  url: "../deposit/deposit",
                });
              } else if(res.data == 2) {
                //跳转到实名认证页面
                wx.navigateTo({
                  url: "../identify/identify",
                });
              } else if(res.data == 3) {
                //已通过，直接到主页
                wx.navigateTo({
                  url: "../index/index",
                });
              }else {
                //用户信息保存失败
                wx.showModal({
                  title: "提示",
                  content: "服务端错误，请稍后再试！",
                  showCancel: false
                });
              }
            }
          });
        } else {
          //校验失败
          wx.showModal({
           title: "提示",
           content: "您输入的验证码有误！请重新输入！",
           showCancel: false
         });
        }
      }
    })
  }
})