/**
 * Created by abhinav on 1/29/2016.
 */
var verify=require('./verificationController'),
    Jwt = require('jsonwebtoken'),
    Constants=require('../Config/Constants'),
    dao=require('../DAO'),
    util=require('../util'),
    async=require('Async'),
    privateKey = Constants.KEYS.REGISTERPRIVATEKEY,
    CONSTANTS=Constants.ROUTECONSTANTS;

var unFollow=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            try {
                var decode = Jwt.decode(token);
            }
            catch(err) {
                callback(err,null);
            }
            callback(null,decode.userId);
        },
        function(userId,callback){
            if(userId)
                dao.userDao.getUserId(followUsername,function(err,followUserId) {
                    if (followUserId)
                        async.parallel([function (callback) {
                                dao.userDao.RemovefromFollowers(userId, followUserId, function (err,isRemoved) {
                                    callback(err,isRemoved);
                                });
                            },
                                function (callback) {
                                    dao.userDao.RemovefromFollowing(userId,followUserId, function (err, isRemoved) {
                                        callback(err,isRemoved);
                                    });
                                }],
                            function (err, results) {
                                if (results[0] && results[1]) {
                                    return callback(err, true);
                                }
                                return callback(err, false)
                            });
                    else callback(null,false)
                });
            else callback(null,false)
        }
    ],function(err,result) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err,result));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.UNFOLLOW,result));
        }
    });
};

var startFollowing=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            try {
                var decode = Jwt.decode(token);
            }
            catch(err) {
                callback(err,null);
            }
            callback(null,decode.userId);
        },
        function(userId,callback){
            if(userId)
                dao.userDao.getUserId(followUsername,function(err,followUserId) {
                    if (followUserId)
                        async.parallel([function (callback) {
                                dao.userDao.addtoFollowers(userId, followUserId, function (err,isAdded) {
                                    callback(err,isAdded);
                                });
                            },
                                function (callback) {
                                    dao.userDao.addtoFollowing(userId,followUserId, function (err, isAdded) {
                                        callback(err,isAdded);
                                    });
                                }],
                            function (err, results) {
                                if (results[0] && results[1]) {
                                    return callback(err, true);
                                }
                                return callback(err, false)
                            });
                    else callback(new Error('invalidusername'),false)
                });
            else callback(new Error('invalidtoken'),false)
        }
    ],function(err) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.FOLLOW));
        }
    });
};

var Login=function(username,password,callback){
    async.waterfall([
        function(callback){
            dao.userDao.isRegistered(username,function(err,isregistered){
                callback(err,isregistered)
            });
        },
        function(isregistered,callback){
            if(isregistered===true) {
                dao.userDao.getPassword(username, function (err, password) {
                    callback(err, password);
                });
            }
            else{
                callback(new Error('usernotverified'),null);
            }
        },
        function(pass,callback) {
            if (password === pass) {
                dao.userDao.getUserId(username,function(err,userId){
                    console.log(userId);
                    callback(err,userId)
                })
            }
            else
                callback(null,null)
        },
        function(userId,callback) {
            if(userId) {
                var token = Jwt.sign({userId: userId}, privateKey);
                dao.userDao.setAccessToken(userId, token, function (err) {
                    return callback(err, token);
                });
            }
            else callback(null,null);
        }
    ],function(err,token) {
        if(err) {
            console.log(err.message);
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.LOGIN),token);
        }
    });
};
var Logout=function(token,callback){
    dao.userDao.setAccessToken((Jwt.decode(token)).userId,0,function(err){
        if(err) {
            console.log(err);
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.LOGOUT));
        }
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
        dao.userDao.addUser(user,function(err){
            callback(err);
        });
    },
        function(callback){
            dao.userDao.getUserId(username,function(err,userId) {
                callback(err,userId);
            });
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
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.REGISTER));
        }
    });
};
module.exports={
    Login:Login,
    Logout:Logout,
    register:register,
    startFollowing:startFollowing,
    unFollow:unFollow
};