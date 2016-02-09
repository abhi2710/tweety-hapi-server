/**
 * Created by abhinav on 2/1/2016.
 */
var Joi=require('joi'),
    controller = require('../../Controllers/index');

var adminRegister={
    method: 'POST',
    path:'/admin/register',
    handler: function (request, reply) {
        controller.adminBaseController.register(request.payload,function(err,result){
                reply(result.response).code(result.statusCode);
            });
    },
    config: {
        description: 'Register an admin',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            payload: {
                adminname:Joi.string().required(),
                email:Joi.string().email().required(),
                firstname:Joi.string().required(),
                lastname:Joi.string().required(),
                password:Joi.string().required(),
                phone:Joi.number().required(),
                scope:Joi.string().required().allow('superAdmin','admin')
            }
        }
    }
};


var adminLogin={
    method: 'POST',
    path:'/admin/login',
    handler: function (request, reply) {
        controller.adminBaseController.Login(request.payload.username,
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

var adminLogout={
    method: 'DELETE',
    path:'/admin/logout',
    handler: function (request, reply) {
        controller.adminBaseController.Logout(request.headers.authorization,function(err,result) {
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


module.exports=[adminLogin,adminRegister,adminLogout];

