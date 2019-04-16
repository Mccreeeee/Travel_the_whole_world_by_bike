package com.darkness.service;

import com.darkness.pojo.User;

public interface UserService {
    boolean sendMsg(String countryCode, String phoneNum);
    boolean verify(String phoneNum, String verifyCode);
    int reg(User user);
    void updateUser(User user);
}
