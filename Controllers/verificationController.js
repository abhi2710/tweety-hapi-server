/**
 * Created by abhinav on 1/15/2016.
 */
var async=require('async'),
    Jwt=require('jsonwebtoken'),
    passhash=require('password-hash-and-salt'),
    Config = require('../Config/email'),
    nodemailer = require("nodemailer"),
    models=require('../models'),
    dao=require('../DAO'),
    util=require('../util'),
    key=require('../Config/Constants'),
    privateKeypass =key.KEYS.PRIVATEKEY,
    privateKeyOne =key.KEYS.REGISTERPRIVATEKEY,
    privateKey = Config.key.REGISTERPRIVATEKEY,
    Constants=require('../Config'),
    errorMessages=Constants.responseMessages.ERROR_MESSAGES,
    successMessages=Constants.responseMessages.SUCCESS_MESSAGES;

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: Config.email.username,
        pass: Config.email.password
    }
});

var sentMailVerificationLink = function(email,token) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Thanks for Registering on "+"Tweety"+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://"+"localhost"+":"+"8500"+"/user/"+"verifyEmail"+"/"+token+"'>Verification Link</a><br><br>NOTE:Above link will expire in 2 hours</p>";
    mail(from, email , "Account Verification", mailbody);
};

var sentMailForgotPassword = function(user,token) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Please click on the reset link below to change your password:<br><a href='http://"+"localhost"+":"+"8500"+"/user/"+"changepassword"+"/"+token+"'>RESET LINK</a><br><br>NOTE:Above link will expire in 2 hours</p>";
    mail(from, user.email,"Account password reset", mailbody,function(err,response){
        console.log("forgot password "+response);
    });
};

function mail(from, email, subject, mailbody){
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };
    smtpTransport.sendMail(mailOptions);
    smtpTransport.close(); /// / shut down the connection pool, no more messages
}

function changePassword(recievedToken,newpassword,callback){
    async.waterfall([function (callback) {
        try {
            Jwt.verify(recievedToken,privateKeypass,function(err, decode) {
                if(err) {
                    callback(new Error(errorMessages.TOKEN_EXPIRED));
                }
                else if(decode.email)
                    callback(null,decode.userId);
                else callback(new Error(errorMessages.SOMETHING_WRONG));
            });
        }
        catch (err) {
            callback(new Error(errorMessages.INVALID_TOKEN), null);
        }
    },
        function(userId,callback) {
            passhash(newpassword).hash(function(err,hash){
                dao.userDao.setPassword(userId,hash,callback);
            });
        }
    ], function (err,result) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else if(result.n===1) {
            return callback(null, util.createSuccessResponseMessage(successMessages.PASSWORD_RESET_SUCCESS));
        }
        else
            return callback(null,util.createErrorResponseMessage(new Error(errorMessages.SOMETHING_WRONG)));
    });
}

function forgetPassword(email,callback){
    async.waterfall([function (callback) {
        dao.userDao.getUserbyEmail(email,callback);
    },
        function(user,callback) {
            var tokendata={userId:user["_id"],
                email:user.email};
            var token = Jwt.sign(tokendata, privateKeypass,{ expiresIn: key.KEYS.TOKENEXPIRY });
            callback(null,user,token)
        }
    ],function (err,user,token) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            sentMailForgotPassword(user, token);
            return callback(null, util.createSuccessResponseMessage(successMessages.PASSWORD_RESET_SUCCESS));
        }
    });
}

function isAuth(recievedToken,model,callback){
    async.waterfall([function (callback) {
        try {
            Jwt.verify(recievedToken,privateKeyOne,function(err, decode) {
                if(err) {
                    callback(new Error(errorMessages.TOKEN_EXPIRED));
                }
                else  if(decode.userId)
                    callback(null,decode.userId);

                else callback(new Error(errorMessages.USER_NOT_VERIFIED));
            });

        }
        catch (err) {
            callback(new Error(errorMessages.INVALID_TOKEN), null);
        }
    },
        function(userId,callback)
        {
            if(model==="user") {
                dao.userDao.getAccessToken(userId,function(err,token) {
                    callback(token,userId)
                });
            }
            else if(model==="admin") {
                dao.adminDao.getAccessToken(userId,function(err,token) {
                    callback(token,userId)
                });
            }
            else
                callback(new Error(errorMessages.ACTION_NO_AUTH));
        },
        function (token,callback) {
            if(token===recievedToken) {
                callback(null,true);
            }
            else callback(new Error(errorMessages.ACTION_NO_AUTH));
        }
    ], function (err, valid) {
        return callback(null,valid);
    });
}

var verify=function(recievedToken,callback){
    async.waterfall([function (callback) {
        try{
            Jwt.verify(recievedToken,privateKeyOne,function(err, decode) {
                if(err) {
                    callback(new Error(errorMessages.TOKEN_EXPIRED));
                }
                else   dao.userDao.getUserId(decode.username,callback);
            });
        }
        catch(err) {
            return callback(new Error(errorMessages.INVALID_TOKEN))
        }
    },
        function (userId,callback) {
            dao.tokenDao.getToken(userId,function(err,token){
                callback(err,token,userId);
            });
        },
        function (token,userId,callback) {
            if (token===recievedToken) {
                dao.userDao.setUserVerified(userId,true,callback);
            }
            else callback(err,null)
        }
    ], function (err,result) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            result="";
            return callback(null,util.createSuccessResponseMessage(successMessages.EMAIL_VERIFIED,result));
        }
    });
};

module.exports={
    verify:verify,
    sentMailVerificationLink:sentMailVerificationLink,
    isAuth:isAuth,
    forgetPassword:forgetPassword,
    changePassword:changePassword
};