/**
 * Created by abhinav on 1/15/2016.
 */
var async=require('async'),
    Jwt=require('jsonwebtoken'),
    Config = require('../Config/email'),
    nodemailer = require("nodemailer"),
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    models=require('../models'),
    dao=require('../DAO'),
    util=require('../util'),
    privateKey = Config.key.REGISTERPRIVATEKEY,
    Constants=require('../Config/Constants'),
    CONSTANTS=Constants.ROUTECONSTANTS,
    errors=Constants.ERRORS;

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: Config.email.username,
        pass: Config.email.password
    }
});

var sentMailVerificationLink = function(email,token) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Thanks for Registering on "+"Tweety"+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://"+"localhost"+":"+"8500"+"/"+"verifyEmail"+"/"+token+"'>Verification Link</a></p>";
    mail(from, email , "Account Verification", mailbody);
};

exports.sentMailForgotPassword = function(user,callback) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>";
    mail(from, user.userName , "Account password", mailbody,function(err,response){
        console.log("forgot password "+response);
        return callback(err,response);
    });
};

// method to decrypt data(password)
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
    var cipher = crypto.createCipher('aes-256-ctr', privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

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
function isAuth(recievedToken,callback){
    async.waterfall([function (callback) {
        try {
            var decode = Jwt.decode(recievedToken);
        }
        catch (err) {
            callback(new Error(errors.INVALID_TOKEN), null);
            return;
        }
        callback(null,decode.userId)
    },
        function (userId, callback) {
            dao.userDao.getAccessToken(userId,callback);
        },
        function (token, callback) {
            if (token === recievedToken) {
                callback(null,true)
            }
        }
    ], function (err, valid) {
        return callback(null,valid);
    });
}

var verify=function(recievedToken,callback){
    async.waterfall([function (callback) {
        try{var decode = Jwt.decode(recievedToken);}
        catch(err) {
            return callback(new Error(errors.INVALID_TOKEN))
        }
        dao.userDao.getUserId(decode.username,callback);
    },
        function (userId,callback) {
            dao.tokenDao.getToken(userId,function(err,token){
                callback(err,token,userId);
            });
        },
        function (token,userId,callback) {
            if (token===recievedToken) {
                dao.userDao.setUserVerified(userId,callback);
            }
            else callback(err,null)
        }
    ], function (err) {
        if(err) {
            return callback(null,util.createErrorResponseMessage(err));
        }
        else {
            return callback(null,util.createSuccessResponseMessage(CONSTANTS.VERIFYEMAIL,result));
        }
    });
};

var Decrypt=function(password,callback){
    return callback(null,decrypt(password));
};

var Encrypt=function(password,callback){
    return callback(null,encrypt(password));
};
module.exports={
    verify:verify,
    sentMailVerificationLink:sentMailVerificationLink,
    isAuth:isAuth,
    Encrypt:Encrypt,
    Decrypt:Decrypt
};