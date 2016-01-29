/**
 * Created by abhinav on 1/25/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index'),
    message="",
    body="";

var Login={
    method: 'POST',
    path:'/login',
    handler: function (request, reply) {
        controller.userController.Login(request.payload.username,
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

var Logout={
    method: 'DELETE',
    path:'/logout',
    handler: function (request, reply) {
        controller.userController.Logout(request.headers.authorization,function(err,result) {
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

module.exports=[Login,Logout];