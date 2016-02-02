/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');
var home={
    method: 'POST',
    path:'/home',
    handler: function (request, reply) {
                controller.tweetsController.display(request.headers.authorization,request.payload.display,request.payload.tweet,function(err,result){
                    reply(result.response).code(result.statusCode);
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
    path:'/Follow',
    handler: function (request, reply) {
                controller.userController.startFollowing(request.headers.authorization,request.payload.username,function(err,result){
                    reply(result.response.message).code(result.statusCode);
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
                controller.userController.stopFollowing(request.headers.authorization,request.payload.username,function(err,result){
                    reply(result.response.message).code(result.statusCode);
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

var editProfile={
    method: 'Put',
    path:'/editProfile',
    handler: function (request, reply) {controller.userController.editProfile(request.headers.authorization,request.payload,
        function(err,result){
            reply(result.response).code(result.statusCode);
        });
    },
    config: {
        description: 'edit profile',
        notes: 'edit profile details',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                username: Joi.string(),
                email:Joi.string().email(),
                firstname:Joi.string(),
                lastname:Joi.string(),
                oldpassword:Joi.string().required(),
                password:Joi.string(),
                phone:Joi.number()
            }
        }
    }
};

//var uploadProfilePic={
//    method: 'POST',
//    path:'/uploadProfilePic',
//    handler: function (request, reply) {
//            reply().view();
//    },
//    config: {
//        description: 'profile pic',
//        notes: 'upload profile picture',
//        tags: ['api'],
//        validate: {
//            headers:Joi.object({
//                'authorization': Joi.string().required()
//            }).options({ allowUnknown: true }),
//            payload: {
//                username: Joi.string().description("username"),
//                picture:Joi.string()
//            }
//        }
//    }
//};

module.exports=[home,follow,unFollow,editProfile];
