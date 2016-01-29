/**
 * Created by abhinav on 1/22/2016.
 */
var async=require('Async'),
    models=require('../models'),
    DAOmanager=require('./DAOmanager');

var getToken=function(userId,callback){
    DAOmanager.getData(models.registerTokens,{userId:userId},{},function(err,document){
        if(err)
        return callback(err)
        return callback(null,document.token);
    });
};

var setToken=function(token,userId,callback){
    DAOmanager.setData (models.registerTokens,{token:token,userId:userId},function (err,result) {
        if (err) {
            return callback(err)
        }
        return callback(null,result);
    });
};

module.exports={
    getToken:getToken,
    setToken:setToken
};