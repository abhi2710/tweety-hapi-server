/**
 * Created by abhinav on 2/5/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');

var adminhome={
    method: 'POST',
    path:'/admin/home',
    handler: function (request, reply) {
        controller.CRUDController.display(request.headers.authorization,request.payload.Action,request.payload.username,request.payload.tweetId,function(err,result){
            reply(result.response).code(result.statusCode);
        });
    },
    config: {
        description: 'Home',
        notes: 'admin home route',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                Action:Joi.allow('Show Users','Delete User','Show User Profile','Delete Tweet','Show Tweets of a User','edit User Profile'),
                username:Joi.string(),
                tweetId:Joi.string()
            }
        }
    }
};
var editUserProfile={
    method: 'POST',
    path:'/admin/editUserProfile',
    handler: function (request, reply) {
        controller.CRUDController.editUserProfile(request.headers.authorization,request.payload.username,
            request.payload,function(err,result){
            reply(result.response).code(result.statusCode);
        });
    },
    config: {
        description: 'Home',
        notes: 'admin home route',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true }),
            payload: {
                username:Joi.string().required(),
                email:Joi.string().email(),
                firstname:Joi.string(),
                lastname:Joi.string(),
                phone:Joi.number()
            }
        }
    }
};

module.exports=[adminhome,editUserProfile];
