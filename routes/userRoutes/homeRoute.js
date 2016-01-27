/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');
var home={
    method: 'POST',
    path:'/home',
    handler: function (request, reply) {
        controller.verificationController.isAuth(request.headers.authorization,function(err,flag) {
            if (err)
                console.log(err);
            if(flag===1) {
                if(request.payload.tweet)
                controller.tweetsController.postTweet(request.headers.authorization,request.payload.tweet,function(err,isTweeted){
                    reply(isTweeted);
                });
                else {
                    controller.tweetsController.showTweets(request.headers.authorization,function(err,tweets){
                        reply(tweets);
                    });
                }
            }
        });
    },
    config: {
        description: 'Home',
        notes: 'Shows tweets',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                tweet:Joi.string().min(1).max(160)
            }
        }
    }
};
var follow={
    method: 'POST',
    path:'/addFollower',
    handler: function (request, reply) {
        controller.verificationController.isAuth(request.headers.authorization,function(err,flag) {
            if(flag===1) {
                controller.followController.startFollowing(request.headers.authorization,request.payload.username,function(err,followers){
                    if(followers)
                    reply(followers);
                    else reply("user does not exists!!");
                });
            }
        });
    },
    config: {
        description: 'follow other users',
        notes: 'Shows and adds followers',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                username:Joi.string().min(3).max(15).description("username")
            }
        }
    }
};
module.exports=[home,follow];
