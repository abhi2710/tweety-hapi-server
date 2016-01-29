/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');
var home={
    method: 'POST',
    path:'/home',
    handler: function (request, reply) {
        controller.verificationController.isAuth(request.headers.authorization,function(err,isAuthorized) {
            if(isAuthorized) {
                controller.tweetsController.display(request.headers.authorization,request.payload.display,request.payload.tweet,function(err,result){
                    reply(result.response).code(result.statusCode);
                });
            }
            else reply("Not Authorized!");
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
                display:Joi.allow('Post Tweet','Tweets','Followers','Following','Users'),
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
            if(flag===true) {
                controller.userController.startFollowing(request.headers.authorization,request.payload.username,function(err,result){
                    reply(result.response.message).code(result.statusCode);
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
                username:Joi.string().description("username")
            }
        }
    }
};
var unFollow={
    method: 'POST',
    path:'/unFollow',
    handler: function (request, reply) {
        controller.verificationController.isAuth(request.headers.authorization,function(err,flag) {
            if(flag===true) {
                controller.userController.startFollowing(request.headers.authorization,request.payload.username,function(err,result){
                    reply(result.response.message).code(result.statusCode);
                });
            }
        });
    },
    config: {
        description: 'Unfollow users',
        notes: 'Shows and adds followers',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                username:Joi.string().description("username")
            }
        }
    }
};
module.exports=[home,follow,unFollow];
