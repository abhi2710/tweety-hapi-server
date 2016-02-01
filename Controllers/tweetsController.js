/**
 * Created by abhinav on 1/25/2016.
 */
var jwt = require('jsonwebtoken'),
    async=require('Async'),
    dao=require('../DAO'),
    Constants=require('../Config/Constants'),
    util=require('../util'),
    CONSTANTS=Constants.ROUTECONSTANTS,
    verify=require('./verificationController'),
    errors=Constants.ERRORS;

var display= function(token,display,tweet,callback) {
    switch (display)
    {
        case 'Post Tweet':postTweet(token,tweet,callback);
            break;
        case 'Tweets':showTweets(token,callback);
            break;
        case 'Followers':showFollowers(token,callback);
            break;
        case 'Following':showFollowing(token,callback);
            break;
        case 'Users':showUsers(token,callback);
            break;
    }
};
var showUsers=function(token,callback) {
    async.waterfall([
        function(callback){
            verify.isAuth(token,function(err,isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.getUsers(callback);
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        }
    ],function(err,data)
    {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,data));
        }
    });
};

var showFollowers=function(token,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token)
                    }
                    catch (err) {
                        return callback(err,null);
                    }
                    callback(null,decode.userId);
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(userId,callback){
            dao.userDao.getFollowers(userId,callback);
        }
    ],function(err,followers) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,followers));
        }
    });
};

var showFollowing=function(token,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null,decode.userId);
                    }
                    catch (err) {
                        return callback(new Error(errors.INVALID_TOKEN),null);
                    }
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(userId,callback){
            dao.userDao.getFollowing(userId,callback);
        }
    ],function(err,followers) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,followers));
        }
    });
};

var showTweets=function(token,callback) {
 async.waterfall([
     function(callback) {
         verify.isAuth(token,function(err,isAuthorized) {
             if (isAuthorized) {
                 try {
                     var decode = jwt.decode(token)
                 }
                 catch (err) {
                     return callback(new Error("invalidtoken"),null);
                 }
                 callback(null,decode.userId);
             }
             else
                 callback(new Error("notauthorized"), null);
         });
     },
     function(userId,callback){
        dao.userDao.getFollowingId(userId,function(err,data){
            if(data)
            data.push(userId);
            else data=[userId];
            callback(err,data)
        });
     },
 function(followers,callback) {
     dao.tweetDao.getTweets(followers,callback);
 }],
     function(err,tweets) {
     if (err) {
         return callback(null, util.createErrorResponseMessage(err));
     }
     else {
         return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,tweets));
     }
 });
};
var postTweet=function(token,tweet,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token, function (err, isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        return callback(new Error(errors.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(userId,callback){
            dao.tweetDao.addTweet(userId,tweet,callback);
        }
    ],function(err,tweet) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,tweet));
        }
    });
};
module.exports={
    showTweets:showTweets,
    postTweet:postTweet,
    display:display
};