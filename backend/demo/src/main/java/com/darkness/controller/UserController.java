package com.darkness.controller;

import com.darkness.pojo.User;
import com.darkness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @RequestMapping("/genCode")
    @ResponseBody
    public boolean genVerifyCode(String countryCode, String phoneNum) {
        return userService.sendMsg(countryCode, phoneNum);
    }
    @RequestMapping("/verify")
    @ResponseBody
    public boolean verify(String phoneNum, String verifyCode) {
        return userService.verify(phoneNum, verifyCode);
    }
    @RequestMapping("/reg")
    @ResponseBody
    public int resgister(@RequestBody User user) {
        int flag;
        //try-catch一般在controller层处理
        try {
            flag = userService.reg(user);
        }catch (Exception e) {
            flag = -1;
            e.printStackTrace();
        }
        return  flag;
    }
    @RequestMapping("/deposit")
    @ResponseBody
    public boolean deposit(@RequestBody User user) {
        boolean flag = true;
        try {
            userService.updateUser(user);
        } catch (Exception e) {
            flag = false;
            e.printStackTrace();
        }
        return flag;
    }
    @RequestMapping("/identify")
    @ResponseBody
    public boolean identify(@RequestBody User user) {
        return deposit(user);
    }
}
