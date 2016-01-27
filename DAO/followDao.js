/**
 * Created by abhinav on 1/25/2016.
 */
var models=require('../models'),
    moment=require('moment'),
    DAOmanager=require('../DAO/DAOmanager');

var getFollowers=function(userId,callback) {
    DAOmanager.getData(models.follow, {userId:userId}, {}, {}, function (err, data) {
        if (err) return console.error(err);
        if(data===null){
            return callback(data);
        }
        else
        return callback(err, data.followers);
    });
};

var initiatefollow=function(user,callback){
    DAOmanager.setData (models.follow,user,function (err,isUserSaved) {
        return callback(null,isUserSaved)
    });
};

var addtoFollowing=function(userId,followUserId,callback) {
    DAOmanager.update(models.follow,{userId:followUserId},{$addToSet:{following:userId}},{},function(err,data){
        return callback(null,true);
    });
};

var addtoFollowers=function(userId,followUserId,callback) {
    DAOmanager.update(models.follow,{userId:userId},{$addToSet:{followers:followUserId}},{},function(err,data){
            return callback(null,true);
    });
};

module.exports={
    getFollowers:getFollowers,
    addtoFollowers:addtoFollowers,
    addtoFollowing:addtoFollowing,
    initiatefollow:initiatefollow
};
