package com.darkness.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

//标明Bike实例存入MongoDB的bikes collection中
@Document(collection = "bikes")
public class Bike {
    //标明id作为主键，id等同于MongoDB的_id
    @Id
    private String id;

//    private double bikeLog;
//    private double bikeLat;
    //表示经纬度的数组，[经度，纬度]
    //使用GEO_2DSPHERE索引，因为地图是个球面
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private double[] location;
    //建立一个bike编号的索引
    @Indexed
    private Long bikeNo;
    private int status;
    /*
     * 使用构造器也能够将相应的Json中的data数据转换成Bike对象
     */

    public Bike(String id, double[] location, Long bikeNo, int status) {
        this.id = id;
        this.location = location;
        this.bikeNo = bikeNo;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public double[] getLocation() {
        return location;
    }

    public Long getBikeNo() {
        return bikeNo;
    }

    public int getStatus() {
        return status;
    }
}
