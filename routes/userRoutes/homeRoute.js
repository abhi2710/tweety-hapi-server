/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index'),
    multiparty=require('multiparty'),
    fs=require('fs'),
    util=require('../../util');
var home={
    method: 'POST',
    path:'/user/home',
    handler: function (request, reply) {
        controller.userCRUDController.display(request.headers.authorization,request.payload.display,request.payload.tweet,
            request.payload.username,function(err,result){
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
                display:Joi.allow('Post Tweet','Tweets','Followers','Following','Users','Follow','Unfollow','Re-Tweet','like tweet','unlike tweet').required(),
                tweet:Joi.string().description("Enter tweet_id for retweeting,liking and unliking"),
                username:Joi.string()
            },
            failAction:function(request,reply,source,error){
                reply(util.createJoiErrorResponseMessage(error)).code(400);
            }
        }
    }
};


var editProfile= {
    method: 'PUT',
    path: '/user/editProfile',
    handler: function (request, reply) {
        controller.userBaseController.editProfile(request.headers.authorization, request.payload,
            function (err, result) {
                reply(result.response).code(result.statusCode);
            });
    },
    config: {
        description: 'edit profile',
        notes: 'edit profile details',
        tags: ['api'],
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            payload: {
                username: Joi.string(),
                email: Joi.string().email(),
                firstname: Joi.string(),
                lastname: Joi.string(),
                oldpassword: Joi.string().required(),
                password: Joi.string(),
                phone: Joi.number()
            },
            failAction:function(request,reply,source,error){
                reply(util.createJoiErrorResponseMessage(error)).code(400);
            }
        }
    }
};

var uploadProfilePic={
    method: 'POST',
    path:'/user/profilepic',
    handler: function (request, reply) {
        controller.userCRUDController.uploadProfilePic(request.headers.authorization, request,
            function (err, result) {
                reply(result.response).code(result.statusCode);
            });
    },
    config: {
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                file: Joi.any()
                    .meta({swaggerType: 'file'})
                    .description('json file')
            },
            failAction:function(request,reply,source,error){
                reply(util.createJoiErrorResponseMessage(error)).code(400);
            }
        },
            payload:{
                maxBytes: 20971520000,
                output: 'stream',
                parse: true
            }
        }
};

module.exports=[home,editProfile,uploadProfilePic];
