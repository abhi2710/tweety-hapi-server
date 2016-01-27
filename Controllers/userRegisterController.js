/**
 * Created by abhinav on 1/14/2016.
 */
var verify=require('./verificationController'),
    Jwt = require('jsonwebtoken'),
    Constants=require('../Config/Constants'),
    dao=require('../DAO'),
    privateKey = Constants.KEYS.REGISTERPRIVATEKEY;
var register=function(email,username,firstname,lastname,password,phone,callback)
{
    var tokenData = {
        username:username,
        timestamp:Date.now()
    };
    var token=Jwt.sign(tokenData, privateKey);
    var user= {
        email:email,
        username:username,
        firstname:firstname,
        lastname:lastname,
        password:password,
        phone:phone
    };
    dao.userDao.addUser(user,function(err, isUserAdded){
        if(isUserAdded===true)
        dao.userDao.getUserId(username,function(err,userId){
            dao.tokenDao.setToken(token,userId,function(err,isTokenSet){
                if(isTokenSet===true)
                {
                    verify.sentMailVerificationLink(user.email,token);
                }
                return callback(err,isTokenSet);
            });
        });
        else return callback(err,isUserAdded);
    });
};

module.exports={
    register:register
};