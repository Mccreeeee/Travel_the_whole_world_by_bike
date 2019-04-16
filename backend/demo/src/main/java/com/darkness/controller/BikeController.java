package com.darkness.controller;

import com.darkness.pojo.Bike;
import com.darkness.service.BikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/bike")
public class BikeController {
    @Autowired
    private BikeService bikeService;

    @RequestMapping("/addABike")
    //封装成Json格式的数据发回
    @ResponseBody
    //RequestBody将接收的Json格式数据转换成相应的JavaBean，属性名记得要对应
    public String addABike(@RequestBody Bike bike){
        //保存单车数据到MongoDB，调用service
        bikeService.save(bike);
        return "success";
    }
    @RequestMapping("/findNear")
    @ResponseBody
    public List<GeoResult<Bike>> findNearBikes(double bikeLog, double bikeLat) {
        List<GeoResult<Bike>> bikes = bikeService.findNear(bikeLog, bikeLat);
        return bikes;
    }
}
