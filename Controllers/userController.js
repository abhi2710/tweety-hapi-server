/**
 * Created by abhinav on 1/29/2016.
 */
var verify = require('./verificationController'),
    Jwt = require('jsonwebtoken'),
    Constants = require('../Config/Constants'),
    dao = require('../DAO'),
    util = require('../util'),
    async = require('async'),
    privateKey = Constants.KEYS.REGISTERPRIVATEKEY,
    CONSTANTS = Constants.ROUTECONSTANTS,
    errors=Constants.ERRORS;

var startFollowing=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = Jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        callback(new Error(errors.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(userId,callback){
            if(userId)
                dao.userDao.getUserId(followUsername,function(err,followUserId) {
                    if (followUserId)
                        async.parallel([function (callback) {
                                dao.userDao.addtoFollowers(userId, followUserId,callback);
                            },
                                function (callback) {
                                    dao.userDao.addtoFollowing(userId,followUserId,callback);
                                }],
                            function (err, results) {
                                if (results[0]===1 && results[1]===1) {
                                    return callback(err, true);
                                }
                                else
                                    return callback(new Error(errors.ALREADY_FOLLOWED), false)
                            });
                    else callback(new Error(errors.INVALID_USERNAME),false)
                });
            else callback(new Error(errors.INVALID_TOKEN),false)
        }
    ],function(err) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.UNFOLLOW));
        }
    });
};

var editProfile=function(token,data,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = Jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        console.log(err);
                        callback(new Error(errors.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
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
                    callback(new Error(errors.INVALID_CREDENTIALS));
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
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.EDITDETAILS));
    });
};

var stopFollowing=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,function(err,isAuthorized) {
                if(isAuthorized) {
                    try {
                        var decode = Jwt.decode(token);
                        callback(null,decode.userId);
                    }
                    catch (err) {
                        callback(new Error(errors.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(userId,callback){
            if(userId)
                dao.userDao.getUserId(followUsername,function(err,followUserId) {
                    if (followUserId)
                        async.parallel([function (callback) {
                                dao.userDao.removefromFollowers(userId, followUserId,callback);
                            },
                                function (callback) {
                                    dao.userDao.removefromFollowing(userId,followUserId,callback);
                                }],
                            function (err, results) {
                                if (results[0]===1 && results[1]===1) {
                                    return callback(err, true);
                                }
                                else
                                    return callback(new Error(errors.ALREADY_UNFOLLOWED), false)
                            });
                    else callback(new Error(errors.INVALID_USERNAME),false)
                });
            else callback(new Error(errors.INVALID_TOKEN),false)
        }
    ],function(err) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.UNFOLLOW));
        }
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
                callback(new Error(errors.USER_NOT_VERIFIED),null);
        },
        function(pass,callback) {
            if (password === pass) {
                dao.userDao.getUserId(username,callback)
            }
            else
                callback(new Error(errors.INVALID_CREDENTIALS),null)
        },
        function(userId,callback) {
            if(userId) {
                var token = Jwt.sign({userId: userId}, privateKey);
                dao.userDao.setAccessToken(userId, token, function (err) {
                    return callback(err, token);
                });
            }
            else callback(new Error(errors.SOMETHING_WENT_WRONG),null);
        }
    ],function(err,token) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.LOGIN),token);
        }
    });
};
var Logout=function(token,callback){
    verify.isAuth(token,function(err,isAuthorized) {
        if (isAuthorized) {
            dao.userDao.setAccessToken((Jwt.decode(token)).userId,0,function(err){
                if(err) {
                    console.log(err);
                    return callback(null,util.createErrorResponseMessage(err));
                }
                else {
                    return callback(null,util.createSuccessResponseMessage(CONSTANTS.LOGOUT));
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
        function(callback){
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
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.REGISTER));
        }
    });
};
module.exports={
    Login:Login,
    Logout:Logout,
    register:register,
    startFollowing:startFollowing,
    stopFollowing:stopFollowing,
    editProfile:editProfile
};