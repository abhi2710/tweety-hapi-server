/**
 * Created by abhinav on 1/22/2016.
 */
var async=require('Async'),
    models=require('../models'),
    DAOmanager=require('./DAOmanager');

var getToken=function(userId,callback){
    console.log(userId);
    DAOmanager.getData(models.registerTokens,{userId:userId},{},function(err,document){
        return callback(null,document.token);
    });
}

var setToken=function(token,userId,callback){
    DAOmanager.setData (models.registerTokens,{token:token,userId:userId},function (err,isTokenset) {
        if (err) {
             console.error(err);
        }
        return callback(err,isTokenset)
    });
};


module.exports={
    getToken:getToken,
    setToken:setToken
};