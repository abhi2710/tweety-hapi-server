/**
 * Created by abhinav on 1/28/2016.
 */
    var Config=require('./Config'),
        errorMessages=Config.responseMessages.ERROR_MESSAGES,
        successMessages=Config.responseMessages.SUCCESS_MESSAGES,
        Constants=require('./Config/Constants'),
        CONSTANTS=Constants.ROUTECONSTANTS;

var createErrorResponseMessage=function(err,result){
    var error={
        response:{
            message:"Bad Request",
            data:""
        },
        statusCode:400
    };
if(err.code===11000) {
    error.response.message=errorMessages.USERNAME_OR_EMAIL_TAKEN;
}
else if(err.name==='SyntaxError') {
    error.response.message = errorMessages.INVALID_TOKEN;
}
    if(err.message==='usernotverified') {
        error.response.message = errorMessages.USER_NOT_VERIFIED;
    }
    else  if(err.message==='invalidtoken') {
        error.response.message = errorMessages.INVALID_TOKEN;
    }
    else  if(err.message==='invalidusername') {
        error.response.message = errorMessages.INVALID_ID;
    }
    if(result===false) {
        error.response.message = errorMessages.ALREADY_NOT_FOLLOWED;
    }
return error;
};


var createSuccessResponseMessage=function(route,result){
    var success={
        response:{
            message:successMessages.ACTION_COMPLETE,
            data:result
        },
        statusCode:200
    };
switch(route){
    case CONSTANTS.REGISTER: success.response.message=successMessages.REGISTRATION_SUCCESSFUL+successMessages.EMAIL_SENT;
        success.statusCode=201;
          break;
    case CONSTANTS.LOGIN: success.response.message=successMessages.LOGIN_SUCCESSFULLY;
         break;
    case CONSTANTS.VERIFYEMAIL:success.response.message=successMessages.EMAIL_VERIFIED;
         break;
    case CONSTANTS.HOME:success.response.message=successMessages.ACTION_COMPLETE;
        success.statusCode=201;
         break;
    case CONSTANTS.LOGOUT:success.response.message=successMessages.LOGOUT_SUCCESSFULLY;
        break;
        default:success.response.message=successMessages.ACTION_COMPLETE;
        break;

}
    return success;
};
module.exports={
    createErrorResponseMessage:createErrorResponseMessage,
    createSuccessResponseMessage:createSuccessResponseMessage};
