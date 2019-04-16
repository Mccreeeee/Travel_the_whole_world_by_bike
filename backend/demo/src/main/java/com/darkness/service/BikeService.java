package com.darkness.service;

import com.darkness.pojo.Bike;
import org.springframework.data.geo.GeoResult;

import java.util.List;

public interface BikeService {
    void save(Bike bike);

    List<GeoResult<Bike>> findNear(double bikeLog, double bikeLat);
}
