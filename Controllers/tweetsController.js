/**
 * Created by abhinav on 1/25/2016.
 */
var jwt = require('jsonwebtoken'),
    async=require('Async'),
    dao=require('../DAO'),
    Constants=require('../Config/Constants'),
    util=require('../util'),
    CONSTANTS=Constants.ROUTECONSTANTS;

var display= function(token,display,tweet,callback) {
    switch (display)
    {
        case 'Post Tweet':postTweet(token,tweet,function(err,result) {
            return callback(err,result);
        });
            break;
        case 'Tweets':showTweets(token,function(err,result) {
            return callback(err,result);
        });
            break;
        case 'Followers':showFollowers(token,function(err,result){
            return callback(err,result);
        });
            break;
        case 'Following':showFollowing(token,function(err,result){
                return callback(err,result);
            });
            break;
        case 'Users':
                showUsers(function(err,result) {
                    return callback(err, result);
                });
            break;
    }
}
var showUsers=function(callback) {
    async.waterfall([
        function(callback){
            dao.userDao.getUsers(function(err,data){
                callback(err,data)
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
            try {
                var decode = jwt.decode(token)
            }
            catch (err) {
                return callback(err,null);
            }
            callback(null,decode.userId);
        },
        function(userId,callback){
            dao.userDao.getFollowers(userId,function(err,data){
                console.log(data);
                callback(err,data)
            });
        }
    ],function(err,followers)
    {
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
            try {
                var decode = jwt.decode(token)
            }
            catch (err) {
                return callback(err,null);
            }
            callback(null,decode.userId);
        },
        function(userId,callback){
            dao.userDao.getFollowing(userId,function(err,data){
                callback(err,data)
            });
        }
    ],function(err,followers)
    {
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
         try {
             var decode = jwt.decode(token)
         }
         catch (err) {
            return callback(err,null);
         }
         callback(null,decode.userId);
     },
     function(userId,callback){
        dao.userDao.getFollowers(userId,function(err,data){
            if(data)
            data.push(userId);
            else data=[userId];
            callback(err,data)
        });
     },
 function(followers,callback) {
     dao.tweetDao.getTweets(followers,function(err,tweets){
         callback(err,tweets)
  });
 }
 ],function(err,tweets)
 {
     if (err) {
         return callback(null, util.createErrorResponseMessage(err));
     }
     else {
         return callback(null, util.createSuccessResponseMessage(CONSTANTS.TWEETS,tweets));
     }
 });
};
var postTweet=function(token,tweet,callback)
{
    async.waterfall([
        function(callback) {
            try {
                var decode = jwt.decode(token)
            }
            catch (err) {
                return callback(err,null);
            }
            callback(null,decode.userId);
        },
        function(userId,callback){
            dao.tweetDao.addTweet(userId,tweet,function(err,tweet){
                callback(null,tweet)
            });
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