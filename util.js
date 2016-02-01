/**
 * Created by abhinav on 1/28/2016.
 */
    var Config=require('./Config'),
        errorMessages=Config.responseMessages.ERROR_MESSAGES,
        successMessages=Config.responseMessages.SUCCESS_MESSAGES,
        Constants=require('./Config/Constants'),
        CONSTANTS=Constants.ROUTECONSTANTS,
        errors=Constants.ERRORS;

var createErrorResponseMessage=function(err){
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
    switch(err.message)
    {
        case errors.USER_NOT_VERIFIED:error.response.message = errorMessages.USER_NOT_VERIFIED;
            break;
        case errors.INVALID_TOKEN:error.response.message = errorMessages.INVALID_TOKEN;
            break;
        case errors.INVALID_USERNAME:error.response.message = errorMessages.INVALID_ID;
            break;
        case errors.NOT_AUTHORIZED:error.response.message = errorMessages.ACTION_NO_AUTH;
            error.statusCode=401;
            break;
        case errors.ALREADY_FOLLOWED:error.response.message = errorMessages.ALREADY_FOLLOWED;
            break;
        case errors.ALREADY_UNFOLLOWED:error.response.message = errorMessages.ALREADY_NOT_FOLLOWED;
            break;
        default:error.response.message =errorMessages.BAD_REQUEST;
            break;
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
