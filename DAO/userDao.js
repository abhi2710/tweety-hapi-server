var models=require('../models'),
    DAOmanager=require('./DAOmanager'),
    options={};

var getPassword=function(userId,callback){
    DAOmanager.getData(models.users,{_id:userId},{},function(err,document){
        return callback(null,document.password);
    });
};

var getAccessToken=function(userId,callback){
    DAOmanager.getData(models.users,{_id:userId},{},function(err,document) {
        if(err)
        {
            console.log(err);
            return callback(null,false);
        }
        return callback(null, document.accessToken);
    });
};

var setAccessToken=function(userId,token) {
    DAOmanager.update(models.users, {_id: userId}, {accessToken: token}, options, function (err,isTokenSet) {
        if (err) return console.error(err);
    });
};

var setUserVerified=function(userId){
    DAOmanager.update(models.users,{_id:userId},{isVerified:true},options,function (err) {
        if (err) return console.error(err);
    });
};

var isRegistered=function(userId,callback) {
    DAOmanager.getData(models.users, {_id:userId}, {}, function (err, document) {
        return callback(null, document.isVerified);
    });
};
var getUserId=function(username,callback){
    console.log(username);
    DAOmanager.getData(models.users, {username:username}, {}, function (err, document) {
        console.log(document);
        if(document) {
            return callback(null,document._id);
        }
        else return callback(err,null);

});
};
var addUser=function(user,callback){
    DAOmanager.setData (models.users,user,function (err,isUserSaved) {
        return callback(null,isUserSaved)
    });
};

module.exports={
    getPassword:getPassword,
    setAccessToken:setAccessToken,
    getAccessToken:getAccessToken,
    isRegistered:isRegistered,
    setUserVerified:setUserVerified,
    addUser:addUser,
    getUserId:getUserId
};