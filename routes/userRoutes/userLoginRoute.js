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
        controller.userLoginController.Login(request.payload.username,
            request.payload.password,function(err,Loginobj){
                if(Loginobj.status===1)
                {
                    message="Login successful";
                    body="token is "+Loginobj.token;
                }
                else if(Loginobj.status===-1)
                {
                    message="You are not registered";
                    body="";
                }
                else{
                    message="Incorrect Username/Password";
                    body="";
                }
                reply(
                    {
                        message:message,
                        body:body
                    }
                ).header("authorization",Loginobj.token);
            });
    },
    config: {
        description: 'Login',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        validate: {
            payload: {
                username:Joi.string().required(),
                password:Joi.string().required(),
            }
        }
    }
};

var Logout={
    method: 'DELETE',
    path:'/logout',
    handler: function (request, reply) {
        controller.userLoginController.Logout(request.headers.authorization,function(err,isLoggedOut) {
            if(isLoggedOut===1)
                reply("you are now logged out!");
            else{
                reply("Failed");
            }
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