package com.darkness.service;

import com.darkness.pojo.Bike;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.NearQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BikeServiceImp implements BikeService {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void save(Bike bike) {
        //普通方式进行保存
        //mongoTemplate.insert(bike,"bikes");
        //使用JPA方式通过注解进行保存
        mongoTemplate.insert(bike);
    }

    /**
     * 根据当前经纬度，查询附近的单车
     */
    @Override
    public List<GeoResult<Bike>> findNear(double bikeLog, double bikeLat) {
        //查询所有单车
        //return mongoTemplate.findAll(Bike.class);
        //指定限制在当前经纬度附近查找
        NearQuery nearQuery = NearQuery.near(bikeLog, bikeLat);
        //指定查找范围和距离（半径200米）
        nearQuery.maxDistance(0.2, Metrics.KILOMETERS);
        //再限定只查找status为0的最近的20辆单车
        Query query = new Query();
        query.addCriteria(Criteria.where("status").is(0)).limit(20);
        GeoResults<Bike> geoResults = mongoTemplate.geoNear(nearQuery.query(query), Bike.class);
        return geoResults.getContent();
    }
}
