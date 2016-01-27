var jwt = require('jsonwebtoken'),
    Constants=require('../Config/Constants'),
    async=require('Async'),
    dao=require('../DAO'),
    privateKey = Constants.KEYS.REGISTERPRIVATEKEY;

var Login=function(username,password,callback){
    var status=0;
    async.waterfall([
        function(callback){
            dao.userDao.getUserId(username,function(err,userId){
                dao.userDao.isRegistered(userId,function(err,isregistered){
                    if(err) throw err;
                    callback(null,isregistered,userId)
                });
            });
        },
        function(isregistered,userId,callback){
            if(isregistered===true) {
                dao.userDao.getPassword(userId, function (err, pass) {
                    if (err) {
                        console.log(err);
                        callback(err, false)
                    }
                    callback(null,pass,userId);
                });
            }
        },
        function(pass,userId,callback) {
            if (password === pass) {
                status = 1;
                var token = jwt.sign({userId:userId}, privateKey);
                dao.userDao.setAccessToken(userId,token);
            }
            else if(pass===false)
                    status=-1;
            else status=0;
            var Loginobj = {
                status: status,
                token: token
            };
            callback(null,Loginobj)
        }
    ],function(err,Loginobj) {
        if(err)
            console.log(err,null);
        return callback(null,Loginobj);
    });
};

var Logout=function(token,callback){
             dao.userDao.setAccessToken((Jwt.decode(token)).userId,0,function(err,isTokenSet){
                 callback(null,isTokenSet);
             });
};

module.exports={Login:Login,
Logout:Logout};