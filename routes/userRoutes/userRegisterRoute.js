/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index'),
    message,body;

var Register={
    method: 'POST',
    path:'/register',
    handler: function (request, reply) {
        controller.userRegisterController.register(request.payload.email,request.payload.username,request.payload.firstname,request.payload.lastname,
            request.payload.password,request.payload.phone,function(err,isRegistered){
                if(isRegistered===true)
                    reply({
                        message:"user registered!",
                        body:"please verify your account with the email sent to:" + request.payload.email
                    });
                else {
                    reply({
                        message: "NOT REGISTERED!",
                        body: "username/email already exists! please re-check your details!!"
                    });
                }
            });
    },
    config: {
        description: 'Register a user',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            payload: {
                email:Joi.string().required(),
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
        controller.verificationController.verify(request.params.token,function(err,isValid){
            if (isValid===true) {
                reply("Account verified!Please Login to Continue "+"<a href=http://localhost:8500/documentation#!/login/login>LOGIN</a>");
            }
            else {
                reply("Account not verified!!");
            }
        });
    },
    config: {
        description: 'Provide Sorting method and input array',
        notes: 'Returns a sorted array using the method specified passed in the path',
        tags: ['api']
    }
};

module.exports=[Register,verifyEmail];

