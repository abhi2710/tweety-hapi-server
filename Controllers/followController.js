/**
 * Created by abhinav on 1/25/2016.
 */
var jwt = require('jsonwebtoken'),
    Constants=require('../Config/Constants'),
    async=require('Async'),
    dao=require('../DAO');
var startFollowing=function(token,followUsername,callback)
{
    async.waterfall([
        function(callback) {
            var decode=jwt.decode(token);
            callback(null,decode.userId);
        },
        function(userId,callback){
                if(userId)
                    dao.userDao.getUserId(followUsername,function(err,followUserId) {
                        if (followUserId)
                            async.parallel([function (callback) {
                                    dao.followDao.addtoFollowers(userId, followUserId, function (err, isAdded) {
                                        callback(null, isAdded);
                                    });
                                },
                                    function (callback) {
                                        dao.followDao.addtoFollowing(userId,followUserId, function (err, isAdded) {
                                            callback(null, isAdded);
                                        });
                                    }],
                                function (err, results) {
                                    if (results[0] && results[1]) {
                                        return callback(null, true);
                                    }
                                    return callback(null, false)
                                });
                        else callback(null,false)
                    });
                else callback(null,false)
        }
    ],function(err,result){
        if(err)console.log(err);
        return callback(null,result)

    });
};
module.exports={
    startFollowing:startFollowing
};