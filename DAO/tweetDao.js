/**
 * Created by abhinav on 1/25/2016.
 */
var models=require('../models'),
    DAOmanager=require('../DAO/DAOmanager');

var addTweet=function(userId,tweet,callback) {
    var data={
        userId:userId,
        tweet_text:tweet,
        time:new Date(new Date()).toISOString()
    };
    DAOmanager.setData(models.tweet,data,function (err,doc) {
        return callback(err,doc.tweet_text);
    });
};

var deleteTweet=function(tweet_id,callback) {
    DAOmanager.update(models.tweet,{_id:tweet_id},{$set:{isDeleted:true}},{},function (err,doc) {
        return callback(err,doc.tweet_text);
    });
};

var getUserTweets=function(userId,callback) {
    DAOmanager.getallData(models.tweet, {userId:userId},{}, {},function (err,data) {
        if (err) return console.error(err);
        var tweetsArr=[];
        for(key in data) {
            var tweet={};
            tweet['tweet']=data[key].tweet_text;
            tweet['time']=data[key].time;
            tweet['isDeleted']=data[key].isDeleted;
            tweetsArr.push(tweet);
        }
        return callback(err,tweetsArr);
    });
};

var getTweets=function(followers,callback) {
    DAOmanager.getDataWithReference(models.tweet, {userId:{$in:followers}},{}, {},{
        path: 'userId',
        select: 'username firstname lastname',
       // match:{'isDeleted':"false"},
        options: { lean:true,sort:{time:-1} }
    },function (err,data) {
        if (err) return console.error(err);
        var tweetsArr=[];
        for(key in data) {
                var tweet = {};
                tweet['username'] = data[key].userId.username;
                tweet['firstname'] = data[key].userId.firstname;
                tweet['lastname'] = data[key].userId.lastname;
                tweet['tweet'] = data[key].tweet_text;
                tweet['time'] = data[key].time;
                tweetsArr.push(tweet);
        }
        return callback(err,tweetsArr);
    });
};
module.exports={
    addTweet:addTweet,
    getTweets:getTweets,
    getUserTweets:getUserTweets,
    deleteTweet:deleteTweet
};
