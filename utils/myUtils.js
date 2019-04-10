function get(key) {
  var value = wx.getStorageSync(key);
  if (!value) {
    value = getApp().globalData[key];
  }
  return value;
}
function findNear(log, lat, that) {
  wx.request({
    url: 'http://localhost:8080/bike/findNear',
    method: "GET",
    data: {
      "bikeLog": log,
      "bikeLat": lat
    },
    success: function(res) {
      var bikes = res.data.map((geoResult) => {
        return {
          id: geoResult.content.id,
          longitude: geoResult.content.location[0],
          latitude: geoResult.content.location[1],
          iconPath: "/images/bike.png",
          width: 35,
          height: 40
        }
      });
      that.setData({
        markers: bikes
      });
    }
  })
}
module.exports = {
  get,
  findNear
}