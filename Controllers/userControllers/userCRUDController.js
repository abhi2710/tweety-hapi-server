/**
 * Created by abhinav on 2/6/2016.
 */
var jwt = require('jsonwebtoken'),
    async=require('Async'),
    dao=require('../../DAO/index'),
    Constants=require('../../Config'),
    util=require('../../util'),
    verify=require('./../verificationController'),
    errorMessages=Constants.responseMessages.ERROR_MESSAGES,
    successMessages=Constants.responseMessages.SUCCESS_MESSAGES;

var display= function(token,display,tweet,username,callback) {
    switch (display) {
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
        case 'Follow':startFollowing(token,username,callback);
            break;
        case 'Unfollow':stopFollowing(token,username,callback);
            break;
        case 'Re-Tweet':ReTweet(token,tweet,callback);
            break;
    }
};

var startFollowing=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            if(followUsername==="")
                callback(new Error(errorMessages.INVALID_ID), null);
            verify.isAuth(token,'user',function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        callback(new Error(errorMessages.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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
                                    return callback(new Error(errorMessages.ALREADY_FOLLOWED), false)
                            });
                    else callback(new Error(errorMessages.INVALID_ID),false)
                });
            else callback(new Error(errorMessages.INVALID_TOKEN),false)
        }
    ],function(err) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE));
        }
    });
};

var stopFollowing=function(token,followUsername,callback) {
    async.waterfall([
        function(callback) {
            if(followUsername==="")
                callback(new Error(errorMessages.INVALID_ID), null);
            verify.isAuth(token,'user',function(err,isAuthorized) {
                if(isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null,decode.userId);
                    }
                    catch (err) {
                        callback(new Error(errorMessages.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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
                                    return callback(new Error(errorMessages.ALREADY_FOLLOWED), false)
                            });
                    else callback(new Error(errorMessages.INVALID_ID),false)
                });
            else callback(new Error(errorMessages.INVALID_TOKEN),false)
        }
    ],function(err) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE));
        }
    });
};

var showUsers=function(token,callback) {
    async.waterfall([
        function(callback){
            verify.isAuth(token,"user",function(err,isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.getUsers(callback);
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        }
    ],function(err,data)
    {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,data));
        }
    });
};

var showFollowers=function(token,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,"user",function(err,isAuthorized) {
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
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,followers));
        }
    });
};

var showFollowing=function(token,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,"user",function(err,isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null,decode.userId);
                    }
                    catch (err) {
                        return callback(new Error(errorMessages.INVALID_TOKEN),null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,followers));
        }
    });
};

var showTweets=function(token,callback) {
    async.waterfall([
            function(callback) {
                verify.isAuth(token,"user",function(err,isAuthorized) {
                    if (isAuthorized) {
                        try {
                            var decode = jwt.decode(token)
                        }
                        catch (err) {
                            return callback(new Error(errorMessages.INVALID_TOKEN),null);
                        }
                        callback(null,decode.userId);
                    }
                    else
                        callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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
                return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,tweets));
            }
        });
};

var ReTweet=function(token,tweet_id,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,"user", function (err, isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        return callback(new Error(errorMessages.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        },
        function(userId,callback){
            dao.tweetDao.getTweet(tweet_id,function(err,tweet,retweetedfrom){
                callback(err,userId,tweet,retweetedfrom)
            });
        },
        function(userId,tweet,retweetedfrom,callback){
            var data={
                userId:userId,
                tweet_text:tweet,
                time:new Date(new Date()).toISOString(),
                retweetedfrom:retweetedfrom
            };
            dao.tweetDao.addTweet(userId,data,function(err,tweet){
                callback(err,userId)
            });
        },
        function(userId,callback){
            dao.tweetDao.addReTweet(userId,tweet_id,callback);
        }
    ],function(err,tweet) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,tweet));
        }
    });
};


var postTweet=function(token,tweet,callback) {
    async.waterfall([
        function(callback) {
            verify.isAuth(token,"user", function (err, isAuthorized) {
                if (isAuthorized) {
                    try {
                        var decode = jwt.decode(token);
                        callback(null, decode.userId);
                    }
                    catch (err) {
                        return callback(new Error(errorMessages.INVALID_TOKEN), null);
                    }
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        },
        function(userId,callback){
            var data={
                userId:userId,
                tweet_text:tweet,
                time:new Date(new Date()).toISOString()
            };
            dao.tweetDao.addTweet(userId,data,callback);
        }
    ],function(err,tweet) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,tweet));
        }
    });
};
module.exports={
    showTweets:showTweets,
    postTweet:postTweet,
    display:display
};