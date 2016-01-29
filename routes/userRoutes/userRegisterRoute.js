/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');

var Register={
    method: 'POST',
    path:'/register',
    handler: function (request, reply) {
        controller.userController.register(request.payload.email,request.payload.username,request.payload.firstname,request.payload.lastname,
            request.payload.password,request.payload.phone,function(err,result){
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
                phone:Joi.number().required()
            }
        }
    }
};

var verifyEmail={
    method: 'GET',
    path:'/verifyEmail/{token}',
    handler: function (request, reply) {
        controller.verificationController.verify(request.params.token,function(err,result){
            reply(result.response).code(result.statusCode);

        });
    },
    config: {
        description: 'Provide Sorting method and input array',
        notes: 'Returns a sorted array using the method specified passed in the path',
        tags: ['api']
    }
};

module.exports=[Register,verifyEmail];

