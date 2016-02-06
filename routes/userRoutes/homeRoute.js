/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');
var home={
    method: 'POST',
    path:'/user/home',
    handler: function (request, reply) {
                controller.userCRUDController.display(request.headers.authorization,request.payload.display,request.payload.tweet,request.payload.username,function(err,result){
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
                display:Joi.allow('Post Tweet','Tweets','Followers','Following','Users','Follow','Unfollow'),
                tweet:Joi.string(),
                username:Joi.string()
            }
        }
    }
};


var editProfile={
    method: 'Put',
    path:'/user/editProfile',
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

module.exports=[home,editProfile];
