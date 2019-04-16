package com.darkness.service;

import com.darkness.pojo.User;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Override
    public boolean sendMsg(String countryCode, String phoneNum){
        boolean flag = true;
        //生成一个4位随机数字
        String code = (int)(Math.random() * 9000) + 1000 + "";
        //调用腾讯云短信接口API
        int appId = Integer.parseInt(stringRedisTemplate.opsForValue().get("appId"));
        String appKey = stringRedisTemplate.opsForValue().get("appKey");
        int templateId = 308166;
        String[] params = {code, "1"};
        //向对应手机号发送短信
        SmsSingleSender ssender = new SmsSingleSender(appId, appKey);
        try {
            //发送模板ID短信，发送失败则进入catch块
            ssender.sendWithParam(countryCode, phoneNum,
                    templateId, params, "", "", "");
            //单发短信
            //ssender.send(0,countryCode,phoneNum,"【单车行】您的验证码为："+
            //        code + "请在1分钟内输入。如非本人操作，请忽略此短信。", "", "");
            //将发送的手机号作为key，验证码作为value保存到redis中，有效时限1分钟
            stringRedisTemplate.opsForValue().set(phoneNum, code, 1, TimeUnit.MINUTES);
        }catch (Exception e){
            flag = false;
            e.printStackTrace();
        }
        return flag;
    }

    @Override
    public boolean verify(String phoneNum, String verifyCode) {
        boolean flag = false;
        String code = stringRedisTemplate.opsForValue().get(phoneNum);
        if(code != null && code.equals(verifyCode)){
            flag = true;
        }
        return flag;
    }

    @Override
    public int reg(User user) {
        int flag = -1;
        Query query = new Query();
        query.addCriteria(Criteria.where("phoneNum").is(user.getPhoneNum()));
        List<User> userList = mongoTemplate.find(query,User.class);
        //为空代表这个账号未曾注册过，则将其加入MongoDB，注册过则不再加入
        if(userList.isEmpty()) {
            flag = user.getStatus();
            mongoTemplate.insert(user);
        } else {
            //处理手机断电内存清空同时SD卡也被清除的特殊情况
            //因为手机号只会存一次，所以直接get(0)取出即可
            User userInDB = userList.get(0);
            Update update = new Update();
            //判断是否交过押金及是否实名认证过，并修改对应的状态
            if(Double.compare(userInDB.getDeposit(),0) != 0) {
                if(userInDB.getTrueName() != null) {
                    //交过押金且实名认证过了，改状态为3
                    update.set("status", 3);
                    flag = 3;
                } else {
                    //只交了押金，改状态为2
                    update.set("status",2);
                    flag = 2;
                }
            }
            //进行更新
            mongoTemplate.findAndModify(query, update, User.class);
        }
        return flag;
    }

    @Override
    public void updateUser(User user) {
        Update update = new Update();
        if(Double.compare(user.getDeposit(),0) != 0){
            update.set("deposit",user.getDeposit());
        }
        if(user.getTrueName() != null) {
            update.set("trueName", user.getTrueName());
        }
        if(user.getIdNum() != null){
            update.set("idNum", user.getIdNum());
        }
        update.set("status", user.getStatus());
        Query query = new Query();
        query.addCriteria(Criteria.where("phoneNum").is(user.getPhoneNum()));
        mongoTemplate.findAndModify(query, update, User.class);
    }
}
