var async=require('async'),
    jwt=require('jsonwebtoken'),
    dao=require('../../service/index'),
    Constants=require('../../Config/'),
    util=require('../../util'),
    verify=require('./../verificationController'),
    key=require('../../Config/Constants'),
    privateKey =key.KEYS.REGISTERPRIVATEKEY,
    errorMessages=Constants.responseMessages.ERROR_MESSAGES,
    successMessages=Constants.responseMessages.SUCCESS_MESSAGES,
    moment=require('moment');

var display= function(token,display,username,tweet_id,radius,lat,long,time,startTime,endTime,callback) {
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
        case 'show nearby users':showNearbyUser(token,radius,lat,long,callback);
            break;
        case 'show registered user over a time period':showUsersOverTime(token,time,startTime,endTime,callback);
            break;
        case 'show tweets over a time period':showTweetsOverTime(token,time,startTime,endTime,callback);
            break;
        default:showUsers(token,callback);
            break;
    }
};


var showTweetsOverTime=function(token,time,startTime,endTime,callback){
    async.waterfall([
        function(callback){
            verify.isAuth(token,'admin',function(err,isAuthorized) {
                if (isAuthorized) {
                    var end,start,condition;
                    if(startTime && endTime){
                        if(endTime<startTime) {
                            var temp=startTime;
                            startTime=endTime;
                            endTime=temp;
                        }
                        start = moment(startTime).utc().startOf('minute');
                        end=moment(endTime).utc().startOf('minute');
                    }
                    else {
                        end = moment().utc().startOf('minute');
                        switch (time) {
                            case 'year':
                                start = moment(end).subtract(1, 'year');
                                break;
                            case 'month':
                                start = moment(end).subtract(1, 'month');
                                break;
                            case 'week':
                                start = moment(end).subtract(1, 'week');
                                break;
                            default:
                                start = moment(end).subtract(1, 'year');
                                break;
                        }
                    }
                         condition = {
                            time: {$gte:start, $lt:end}
                        };

                    dao.tweetDao.getTweetsOverTime(condition,callback);
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


var showUsersOverTime=function(token,time,startTime,endTime,callback){
    async.waterfall([
        function(callback){
            verify.isAuth(token,'admin',function(err,isAuthorized) {
                if (isAuthorized) {
                    var end,start,condition;
                    if(startTime && endTime){
                        if(endTime<startTime)
                        {
                            var temp=startTime;
                            startTime=endTime;
                            endTime=temp;
                        }
                        start = moment(startTime).utc().startOf('minute');
                        end=moment(endTime).utc().startOf('minute');
                    }
                    else {
                        end = moment().utc().startOf('minute');
                        switch (time) {
                            case 'year':
                                start = moment(end).subtract(1, 'year');
                                break;
                            case 'month':
                                start = moment(end).subtract(1, 'month');
                                break;
                            case 'week':
                                start = moment(end).subtract(1, 'week');
                                break;
                            default:
                                start = moment(end).subtract(1, 'year');
                                break;
                        }
                    }
                    condition = {
                        dateCreated: {$gte:start, $lt:end}
                    };
                    dao.userDao.getUsersOverTime(condition,callback);
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

var showNearbyUser=function(token,radius,lat,long,callback) {
    async.waterfall([
        function(callback){
            if(!radius||!lat||!long)
                callback(new Error(errorMessages.INVALID_CREDENTIALS));
            verify.isAuth(token,'admin',function(err,isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.getNearbyUsers(radius,lat,long,callback);
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
    ],function(err,data) {
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
            if(!username)
                callback(new Error(errorMessages.INVALID_ID));
            verify.isAuth(token,"admin",function(err,isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.getUser(username,callback);
                }
                else callback(new Error(errorMessages.ACTION_NO_AUTH), null);
            });
        }
    ],function(err,user) {
var users={};
        users['USERS']=[user];
        if (err) {
            return callback(null, util.createErrorResponseMessage(err));
        }
        else if (!user) {
            return callback(null, util.createErrorResponseMessage(new Error(errorMessages.USER_NOT_FOUND)));
        }
        else {
                return callback(null, util.createSuccessResponseMessage(successMessages.ACTION_COMPLETE,users));
            }

    });
};

var showTweets=function(token,username,callback) {
    async.waterfall([
            function(callback) {
                if(!username)
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
            if(!tweet_id)
            callback(new Error(errorMessages.INVALID_ID));
            try{
                var decode=jwt.decode(token);
                if(!(decode.scope==="superAdmin")){
                    callback(new Error(errorMessages.ACTION_NO_AUTH))
                }
            }
            catch(err){
                callback(new Error(errorMessages.INVALID_TOKEN), null);
            }
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
            if(!username)
            callback(new Error(errorMessages.INVALID_ID));
            try{
                var decode=jwt.decode(token);
                if(!(decode.scope==="superAdmin")){
                    callback(new Error(errorMessages.ACTION_NO_AUTH))
                }
            }
            catch(err){
                callback(new Error(errorMessages.INVALID_TOKEN), null);
            }
            verify.isAuth(token,"admin", function (err, isAuthorized) {
                if (isAuthorized) {
                    dao.userDao.deleteUser(username,callback);
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH), null);
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

var editUserProfile=function(token,username,data,callback) {
    async.waterfall([
        function(callback) {
            if(!username)
                callback(new Error(errorMessages.INVALID_ID));
            verify.isAuth(token,'admin',function(err,isAuthorized) {
                if (isAuthorized) {
                    delete data['username'];
                    dao.userDao.getUserId(username,function(err,userId){
                        dao.userDao.setUserDetails(userId,data,function(err,res){
                            if(res.nModified==0)
                                callback(new Error(errorMessages.NOTHING_TO_UPDATE));
                            callback(err,userId);
                        });
                    });
                }
                else
                    callback(new Error(errorMessages.ACTION_NO_AUTH),null);
            });
        },
        function(userId,callback) {
            if (data['email']) {
                dao.userDao.setUserVerified(userId,false,function(err,doc) {
                    callback(err,userId)
                });
            }
            else
                callback(null,null);
        },
        function(userId,callback){
            var token = jwt.sign({
                username: username,
                timestamp: Date.now()
            },privateKey);
            dao.tokenDao.setToken(token, userId, function (err,res) {
                verify.sentMailVerificationLink(data['email'],token);
                callback(null);
            });
        }
    ],function(err) {
        if (err)
            return callback(null, util.createErrorResponseMessage(err));
        else
            return callback(null, util.createSuccessResponseMessage(successMessages.DETAILS_SUBMITTED));
    });
};

module.exports={
    showTweets:showTweets,
    display:display,
    deleteTweet:deleteTweet,
    deleteUser:deleteUser,
    editUserProfile:editUserProfile,
    showUsers:showUsers,
    showNearbyUsers:showNearbyUser
};