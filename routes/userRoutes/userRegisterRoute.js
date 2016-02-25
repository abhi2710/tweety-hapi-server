/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');

var Register={
    method: 'POST',
    path:'/user/register',
    handler: function (request, reply) {
        controller.userBaseController.register(request.payload.email,request.payload.username,request.payload.firstname,request.payload.lastname,
            request.payload.password,request.payload.phone,request.payload.latitude,request.payload.longitute,function(err,result){
                reply(result.response).code(result.statusCode);
            });
    },
    config: {
        description: 'Register a user',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            payload: {
                email:Joi.string().email().required(),
                username:Joi.string().required().alphanum().min(3).max(15),
                firstname:Joi.string().required(),
                lastname:Joi.string().required(),
                password:Joi.string().required(),
                phone:Joi.number().required(),
                latitude:Joi.number(),
                longitute:Joi.number()
            }
        }
    }
};

var verifyEmail={
    method: 'GET',
    path:'/user/verifyEmail/{token}',
    handler: function (request, reply) {
        controller.verificationController.verify(request.params.token,function(err,result){
            reply(result.response).code(result.statusCode);

        });
    },
    config: {
        description: 'e-mail Verification link',
        notes: 'Returns a sorted array using the method specified passed in the path',
        tags: ['api']
    }
};

var changePassword={
    method: 'GET',
    path:'/user/changepassword/{token}/{pass}',
    handler: function (request, reply) {
        controller.verificationController.changePassword(request.params.token,request.params.pass,function(err,result){
            reply(result.response).code(result.statusCode);
        });
    },
    config: {
        description: 'change password link',
        notes: 'requires token and new password',
        tags: ['api']
    }
};


var Login={
    method: 'POST',
    path:'/user/login',
    handler: function (request, reply) {
        controller.userBaseController.Login(request.payload.username,
            request.payload.password,function(err,result,token){

                reply(result.response.message).header("authorization",token).code(result.statusCode);
            });
    },
    config: {
        description: 'Login',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            payload: {
                username:Joi.string().required(),
                password:Joi.string().required()
            }
        }
    }
};

var forgetPassword={
    method: 'POST',
    path:'/user/forgetPassword',
    handler: function (request, reply) {
        controller.verificationController.forgetPassword(request.payload.email,function(err,result){
                reply(result.response.message).code(result.statusCode);
            });
    },
    config: {
        description: 'forget password',
        notes: 'send a reset password link to the email',
        tags: ['api'],
        validate: {
            payload: {
                email:Joi.string().required().email()
            }
        }
    }
};

var Logout={
    method: 'DELETE',
    path:'/user/logout',
    handler: function (request, reply) {
        controller.userBaseController.Logout(request.headers.authorization,function(err,result) {
            reply(result.response.message).code(result.statusCode);
        });
    },
    config: {
        description: 'Logout',
        notes: 'logs out of the system',
        tags: ['api'],
        validate: {
            headers:Joi.object({
                'authorization': Joi.string().required()
            }).options({ allowUnknown: true })
        }
    }
};

module.exports=[Register,verifyEmail,Login,Logout,forgetPassword,changePassword];

