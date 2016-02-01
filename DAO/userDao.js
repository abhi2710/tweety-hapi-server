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
    DAOmanager.getDataWithReference(models.users,{_id:userId},{}, {},{
        path: 'followers',
        select: 'username firstname lastname',
        options: {lean:true}
    },function (err,data) {
        if (err) return console.error(err);
        var FollowersArr=[];
        var key=0;
        var len=data[key].followers.length;
        for (var i = 0; i < len; i++) {
            var follower = {};
            follower['username']=data[key].followers[i].username;
            follower['firstname']=data[key].followers[i].firstname;
            follower['lastname']=data[key].followers[i].lastname;
            FollowersArr.push(follower);
        }
        return callback(err,FollowersArr);
    });
};

var getFollowing=function(userId,callback) {
    DAOmanager.getDataWithReference(models.users,{_id:userId},{}, {},{
        path: 'following',
        select: 'username firstname lastname',
        options: {lean:true}
    },function (err,data) {
        if (err) return console.error(err);
        var FollowingArr=[];
        var key=0;
        var len=data[key].following.length;
        for (var i = 0; i < len; i++) {
            var following = {};
            following['username']=data[key].following[i].username;
            following['firstname']=data[key].following[i].firstname;
            following['lastname']=data[key].following[i].lastname;
            FollowingArr.push(following);
        }
        return callback(err,FollowingArr);
    });
};

var getFollowersId=function(userId,callback){
    DAOmanager.getData(models.users, {_id:userId}, {}, {}, function (err, data) {
        if(data)
            return callback(err, data.followers);
        else
            return callback(err,data);
    });
};

var getFollowingId=function(userId,callback) {
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

var addtoFollowing=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:userId},{$addToSet:{following:followUserId}},{},function(err,data){
        return callback(err,data);
    });
};

var addtoFollowers=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:followUserId},{$addToSet:{followers:userId}},{},function(err,data){
        return callback(err,data);
    });
};

var removefromFollowers=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:followUserId},{$pull:{followers:userId}},{},function(err,data){
        return callback(err,data);
    });
};

var removefromFollowing=function(userId,followUserId,callback) {
    DAOmanager.update(models.users,{_id:userId},{$pull:{following:followUserId}},{},function(err,data){
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
    getFollowing:getFollowing,
    getFollowingId:getFollowingId,
    getFollowersId:getFollowersId,
    getUsers:getUsers,
    removefromFollowers:removefromFollowers,
    removefromFollowing:removefromFollowing
};