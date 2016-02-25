/**
 * Created by abhinav on 2/5/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');

var adminhome={
    method: 'POST',
    path:'/admin/home',
    handler: function (request, reply) {
        controller.CRUDController.display(request.headers.authorization,request.payload.Action,request.payload.username,request.payload.tweetId,
            request.payload.radius,request.payload.latitude,request.payload.longitude,
            function(err,result){
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
                Action:Joi.allow('show nearby users','Show Users','Delete User','Show User Profile','Delete Tweet',
                    'Show Tweets of a User'),
                username:Joi.string(),
                tweetId:Joi.string(),
                radius:Joi.number().description("distance in miles"),
                latitude:Joi.number(),
                longitude:Joi.number()
            }
        }
    }
};
var showNearby={
    method: 'POST',
    path:'/admin/shownearbyonmap',
    handler: function (request, reply) {
        controller.CRUDController.showNearbyUsers(request.payload.authorization,request.payload.radius,
            request.payload.lat,request.payload.long,function(err,result){
            reply(result.response.data);
        });
    },
    config: {
        description: 'Home',
        notes: 'admin home route',
        tags: ['api'],
        validate: {
            payload: {
                'authorization': Joi.string().required(),
                'radius': Joi.number().required(),
                'lat': Joi.number().required(),
                'long': Joi.number().required()
            }
        }
    }
};

var showusersonmap={
    method: 'POST',
    path:'/admin/showusersonmap',
    handler: function (request, reply) {
        controller.CRUDController.showUsers(request.payload.authorization,function(err,result){
          reply(result.response.data);
            });
    },
    config: {
        description: 'Home',
        notes: 'admin home route',
        tags: ['api'],
        validate: {
            payload: {
                'authorization': Joi.string().required()
            }
        }
    }
};

var editUserProfile={
    method: 'PUT',
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

module.exports=[adminhome,editUserProfile,showusersonmap,showNearby];
