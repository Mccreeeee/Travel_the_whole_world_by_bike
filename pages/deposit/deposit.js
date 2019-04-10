// pages/deposit/deposit.js

var myUtils = require("../../utils/myUtils.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
   * 点击充值按钮触发的事件
   */
  deposit: function(e){
    //获取用户手机号
    var phoneNum = myUtils.get("phoneNum");
    wx.showModal({
      title: '提示',
      content: '是否要充值押金？',
      success: function(res) {
        //选择确定
        if(res.confirm) {
          wx.showLoading({
            title: '正在充值...',
            mask: true
          });
          //本来应该调用支付接口（模拟）
          //成功后向后台发送请求，并更新用户押金
          wx.request({
            url: "http://localhost:8080/user/deposit",
            method: "POST",
            data: {
              "phoneNum": phoneNum,
              "deposit": 299,
              "status": 2
            },
            success: function(res) {
              //关闭正在充值窗口
              wx.hideLoading();
              //更新用户状态
              //存储状态到内存中
              getApp().globalData.status = 2;
              //存储状态到SD卡中
              wx.setStorageSync("status", 2);
              wx.navigateTo({
                url: '../identify/identify',
              })
            }
          });
        } else {
          //选择取消
        }
      }
    })
  }
})