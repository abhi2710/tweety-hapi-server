var models=require('../models'),
    DAOmanager=require('./DAOmanager');

var getPassword=function(username,callback){
    DAOmanager.getData(models.users,{username:username},{},function(err,document){
        return callback(err,document.password);
    });
};

var getAccessToken=function(userId,callback){
    DAOmanager.getData(models.users,{_id:userId},{},function(err,document) {
        return callback(err, document.accessToken);
    });
};

var setAccessToken=function(userId,token,callback) {
    DAOmanager.update(models.users, {_id: userId}, {accessToken:token},{}, function (err,document) {
        return callback(err, document.accessToken);
    });
};

var setUserVerified=function(userId,callback){
    DAOmanager.update(models.users,{_id:userId},{isVerified:true},{},function (err,document) {
        return callback(err,document.isVerified);
    });
};

var isRegistered=function(username,callback) {
    DAOmanager.getData(models.users, {username:username}, {}, function (err, document) {
        return callback(err, document.isVerified);
    });
};
var getUserId=function(username,callback){
    DAOmanager.getData(models.users, {username:username}, {}, function (err, document) {
        if(document)
            return callback(err,document._id);
        else return callback(err,null);
});
};
var addUser=function(user,callback){
    DAOmanager.setData (models.users,user,function (err,isUserSaved) {
        return callback(err,isUserSaved)
    });
};

var getFollowers=function(userId,callback) {
    DAOmanager.getData(models.users, {_id:userId}, {}, {}, function (err, data) {
        if(data)
            return callback(err, data.followers);
        else
        return callback(err,data);
    });
};
var getFollowing=function(userId,callback) {
    DAOmanager.getData(models.users, {_id:userId}, {}, {}, function (err, data) {
        if(data)
            return callback(err, data.following);
        else
            return callback(err,data);
    });
};
var getUsers=function(callback) {
    DAOmanager.getData(models.users,{}, {}, {}, function (err, data) {
        if(data)
            return callback(err, data.username);
        else
            return callback(err,data);
    });
};

var initiatefollow=function(user,callback){
    DAOmanager.setData (models.users,user,function (err,isUserSaved) {
        return callback(err,isUserSaved)
    });
};

var addtoFollowing=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:followUserId},{$addToSet:{following:userId}},{},function(err,data){
        return callback(err,data);
    });
};

var addtoFollowers=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:userId},{$addToSet:{followers:followUserId}},{},function(err,data){
        console.log("user: "+userId);
        console.log("follow: "+followUserId);
        return callback(err,data);
    });
};

module.exports={
    getPassword:getPassword,
    setAccessToken:setAccessToken,
    getAccessToken:getAccessToken,
    isRegistered:isRegistered,
    setUserVerified:setUserVerified,
    addUser:addUser,
    getUserId:getUserId,
    getFollowers:getFollowers,
    addtoFollowers:addtoFollowers,
    addtoFollowing:addtoFollowing,
    initiatefollow:initiatefollow,
    getFollowing:getFollowing,
    getUsers:getUsers
};