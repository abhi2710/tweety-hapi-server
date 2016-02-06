var async=require('async'),
    dao=require('../../DAO/index'),
    Constants=require('../../Config/'),
    util=require('../../util'),
    verify=require('./../verificationController'),
    errorMessages=Constants.responseMessages.ERROR_MESSAGES,
    successMessages=Constants.responseMessages.SUCCESS_MESSAGES;

var display= function(token,display,username,tweet_id,callback) {
    switch (display) {
        case 'Show Users':showUsers(token,callback);
            break;
        case 'Show User Profile':showUser(token,username,callback);
            break;
        case 'Delete User':deleteUser(token,username,callback);
            break;
        case 'Show Tweets of a User':showTweets(token,username,callback);
            break;
        case 'Delete Tweet':deleteTweet(token,tweet_id,callback);
            break;
        default :showUsers(token,callback);
            break;
    }
};

var showUsers=function(token,callback) {
    async.waterfall([
        function(callback){
            verify.isAuth(token,'admin',function(err,isAuthorized) {
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

var showUser=function(token,username,callback) {
    async.waterfall([
        function(callback) {
            if(username==="")
                callback(new Error(errorMessages.INVALID_ID));
            verify.isAuth(token,"admin",function(err,isAuthorized) {
                if (isAuthorized) {
                   dao.userDao.getUser(username,callback);
                }
                else callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        }
    ],function(err,user) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,user));
        }
    });
};

var showTweets=function(token,username,callback) {
    async.waterfall([
            function(callback) {
                if(username==="")
                    callback(new Error(errorMessages.INVALID_ID));
                verify.isAuth(token,'admin',function(err,isAuthorized) {
                    if (isAuthorized) {
                        dao.userDao.getUserId(username,function(err,userId){
                            dao.tweetDao.getUserTweets(userId,callback);
                        });
                    }
                    else
                        callback(new Error(errorMessages.ACTION_NO_AUTH), null);
                });
            }],
        function(err,tweets) {
            if (err) {
                return callback(null, util.createErrorResponseMessage(err));
            }
            else {
                return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE, tweets));
            }
        });
};
var deleteTweet=function(token,tweet_id,callback) {
    async.waterfall([
        function(callback) {
            if(tweet_id==="")
                callback(new Error(errorMessages.INVALID_ID));
            verify.isAuth(token,'admin', function (err, isAuthorized) {
                if (isAuthorized) {
                    dao.tweetDao.deleteTweet(tweet_id,callback);
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
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

var deleteUser=function(token,username,callback) {
    async.waterfall([
        function(callback) {
            if(username==="")
                callback(new Error(errorMessages.INVALID_ID));
            verify.isAuth(token,"admin", function (err, isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.deleteUser(username,callback);
                }
                else
                    callback(new Error(errors.NOT_AUTHORIZED), null);
            });
        },
        function(result,callback) {
            dao.userDao.getUserId(username,callback)
        },
        function(userId,callback) {
            dao.userDao.removefromFollowingofothers(userId,function(err,result){
                callback(err,userId)
            });
        },
        function(userId,callback) {
            dao.userDao.removefromFollowersofothers(userId,function(err,result){
                callback(err,userId)
            });
        }
    ],function(err,result) {
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else {
            return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE));
        }
    });
};


module.exports={
    showTweets:showTweets,
    display:display,
    deleteTweet:deleteTweet,
    deleteUser:deleteUser
};