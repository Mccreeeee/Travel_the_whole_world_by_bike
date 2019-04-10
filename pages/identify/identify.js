// pages/identify/identify.js
var myUtils = require("../../utils/myUtils.js");
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

  formSubmit: function(e) {
    var phoneNum = myUtils.get("phoneNum");
    var trueName = e.detail.value.name;
    var idNum = e.detail.value.idNum;
    var pattern = /^\d+$/
    if (trueName == ""||pattern.test(idNum) == false) {
      wx.showToast({
        title: "请检查格式是否正确！",
        icon: "none",
        duration: 2000
      });
    } else {
      wx.showLoading({
        title: '正在进行实名认证...',
        mask: true
      });
      wx.request({
        url: "http://localhost:8080/user/identify",
        method: "POST",
        data: {
          "phoneNum": phoneNum,
          "trueName": trueName,
          "idNum": idNum,
          "status": 3
        },
        success: function(res) {
          wx.hideLoading();
          //更新用户状态
          //存储状态到内存中
          getApp().globalData.status = 3;
          //存储状态到SD卡中
          wx.setStorageSync("status", 3);
          wx.navigateTo({
            url: '../index/index',
          })
        }
      })
    }
  }

})