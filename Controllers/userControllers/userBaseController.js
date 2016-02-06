/**
 * Created by abhinav on 2/6/2016.
 */
var verify = require('./../verificationController'),
    Jwt = require('jsonwebtoken'),
    Constants=require('../../Config'),
    dao = require('../../DAO/index'),
    util = require('../../util'),
    async = require('async'),
    key=require('../../Config/Constants'),
    privateKey =key.KEYS.REGISTERPRIVATEKEY,
    errorMessages=Constants.responseMessages.ERROR_MESSAGES,
    successMessages=Constants.responseMessages.SUCCESS_MESSAGES;

var editProfile=function(token,data,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,'user',function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = Jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        console.log(err);
                        callback(new Error(errorMessages.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        },
        function(userId,callback){
            dao.userDao.getPasswordbyId(userId,function(err,pass) {
                if (pass===data['oldpassword']) {
                    console.log("dbpass:"+pass);
                    console.log("oldpass:"+data['oldpassword']);
                    dao.userDao.setUserDetails(userId,data,function (err) {
                        callback(err,userId);
                    });
                }
                else
                    callback(new Error(errorMessages.INVALID_CREDENTIALS));
            });
        },
        function(userId,callback) {
            if (data['email']) {
                dao.userDao.setUserVerified(userId,false,function(err,doc) {
                    dao.userDao.getUsername(userId, function (err, username) {
                        var token = Jwt.sign({
                            username: username,
                            timestamp: Date.now()
                        },privateKey);
                        dao.tokenDao.setToken(token, userId, function (err,res) {
                            verify.sentMailVerificationLink(data['email'],token);
                            callback(null);
                        });
                    });
                });
            }
            else
                callback(null);
        }
    ],function(err) {
        if (err)
            return callback(null, util.createErrorResponseMessage(err));
        else
            return callback(null, util.createSuccessResponseMessage(successMessages.DETAILS_SUBMITTED));
    });
};



var Login=function(username,password,callback){
    async.waterfall([
        function(callback){
            dao.userDao.isRegistered(username,callback);
        },
        function(isregistered,callback){
            if(isregistered===true)
                dao.userDao.getPassword(username,callback);
            else
                callback(new Error(errorMessages.USER_NOT_VERIFIED),null);
        },
        function(pass,callback) {
            if (password === pass) {
                dao.userDao.getUserId(username,callback)
            }
            else
                callback(new Error(errorMessages.INVALID_CREDENTIALS),null)
        },
        function(userId,callback) {
            if(userId) {
                var token = Jwt.sign({userId: userId}, privateKey);
                dao.userDao.setAccessToken(userId, token, function (err) {
                    return callback(err, token);
                });
            }
            else callback(new Error(errorMessages.INVALID_ID),null);
        }
    ],function(err,token) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(successMessages.LOGIN_SUCCESSFULLY),token);
        }
    });
};
var Logout=function(token,callback){
    verify.isAuth(token,'user',function(err,isAuthorized) {
        if (isAuthorized) {
            dao.userDao.setAccessToken((Jwt.decode(token)).userId,0,function(err){
                if(err) {
                    console.log(err);
                    return callback(null,util.createErrorResponseMessage(err));
                }
                else {
                    return callback(null,util.createSuccessResponseMessage(successMessages.LOGOUT_SUCCESSFULLY));
                }
            });
        }
        else
            callback(new Error(errors.NOT_AUTHORIZED), null);
    });
};
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
    async.waterfall([function(callback){
        dao.userDao.addUser(user,callback);
    },
        function(result,callback){
            dao.userDao.getUserId(username,callback);
        },
        function(userId,callback){
            dao.tokenDao.setToken(token,userId,function(err) {
                verify.sentMailVerificationLink(user.email,token);
                callback(err);
            });
        }
    ],function(err){
        if(err) {
            console.log(err);
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(successMessages.REGISTRATION_SUCCESSFUL));
        }
    });
};
module.exports={
    Login:Login,
    Logout:Logout,
    register:register,
    editProfile:editProfile
};