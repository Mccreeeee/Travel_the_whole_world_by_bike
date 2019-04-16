package com.darkness.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
@Document(collection = "users")
public class User {
    @Id
    private String id;
    //电话号码
    @Indexed
    private String phoneNum;
    //注册时间
    private Date regDate;
    //昵称
    private String nickName;
    //真名
    private String trueName;
    //身份证号码
    private String idNum;
    //押金
    private double deposit;
    //状态
    private int status;

    public User(String id, String phoneNum, Date regDate, String nickName, String trueName, String idNum, double deposit, int status) {
        this.id = id;
        this.phoneNum = phoneNum;
        this.regDate = regDate;
        this.nickName = nickName;
        this.trueName = trueName;
        this.idNum = idNum;
        this.deposit = deposit;
        this.status = status;
    }


    public String getPhoneNum() {
        return phoneNum;
    }

    public String getTrueName() {
        return trueName;
    }

    public String getIdNum() {
        return idNum;
    }

    public double getDeposit() {
        return deposit;
    }

    public int getStatus() {
        return status;
    }

    public String getId() {
        return id;
    }

    public Date getRegDate() {
        return regDate;
    }

    public String getNickName() {
        return nickName;
    }
}
