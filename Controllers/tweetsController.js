/**
 * Created by abhinav on 1/25/2016.
 */
var jwt = require('jsonwebtoken'),
    async=require('Async'),
    dao=require('../DAO');
var showTweets=function(token,callback)
{
 async.waterfall([
     function(callback) {
         var decode=jwt.decode(token);
         callback(null,decode.userId);
     },
     function(userId,callback){
        dao.followDao.getFollowers(userId,function(err,data){
                    if(err)
                        return console.log(err);
            if(data===null)
            callback(null,data);
            else callback(null,data)
        });
     },
 function(followers,callback)
 {
     if(followers===null)
     callback(null,followers);
     else dao.tweetDao.getTweets(followers,function(err,tweets){
      callback(null,tweets)
  });
 }
 ],function(err,tweets)
 {
     if(err)
     console.log(err);
     return callback(null,tweets)
 })
};
var postTweet=function(token,tweet,callback)
{
    async.waterfall([
        function(callback) {
            var decode=jwt.decode(token);
            callback(null,decode.userId);
        },
        function(userId,callback){
            dao.tweetDao.addTweet(userId,tweet,function(err,isTweeted){
                callback(null,isTweeted)
            });
        }
    ],function(err,isTweeted)
    {
        if(err)
        console.log(err);
        return callback(null,isTweeted);
    });
};
module.exports={
    showTweets:showTweets,
    postTweet:postTweet
};