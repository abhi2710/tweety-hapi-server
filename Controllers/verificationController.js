/**
 * Created by abhinav on 1/15/2016.
 */
var async=require('Async'),
    Jwt=require('jsonwebtoken'),
    Config = require('../Config/email'),
    nodemailer = require("nodemailer"),
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    models=require('../models'),
    dao=require('../DAO'),
    flag=0,
    privateKey = Config.key.REGISTERPRIVATEKEY;

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: Config.email.username,
        pass: Config.email.password
    }
});

var decrypt = function(password) {
    return decrypt(password);
};

var encrypt = function(password) {
    return encrypt(password);
};

var sentMailVerificationLink = function(email,token) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Thanks for Registering on "+"Tweety"+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://"+"localhost"+":"+"8500"+"/"+"verifyEmail"+"/"+token+"'>Verification Link</a></p>"
    mail(from, email , "Account Verification", mailbody);
};

exports.sentMailForgotPassword = function(user) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>"
    mail(from, user.userName , "Account password", mailbody);
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
    var cipher = crypto.createCipher(algorithm, privateKey);
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

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
function isAuth(recievedToken,callback){
    async.waterfall([function (callback) {
        try {
            var decode = Jwt.decode(recievedToken)
        }
        catch (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null,decode)
    },
        function (decode, callback) {
            userId=decode.userId;
            dao.userDao.getAccessToken(userId,function(err,token){
                callback(null, token);
            });
        },
        function (token, callback) {
            if (token === recievedToken) {
                var valid = 1;
            } else if(token===-1) {
                var valid=-1
            }
            else{
                var valid=0;
            }
            callback(null, valid)
        }
    ], function (err, valid) {
        if (err) {
            console.log(err);
            return err;
        }
        return callback(null,valid);
    });
}

var verify=function(recievedToken,callback){
    var username;
    async.waterfall([function (callback) {
        try {
            var decode = Jwt.decode(recievedToken)
        }
        catch (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null,decode.username);
    },
        function (username,callback) {
            dao.userDao.getUserId(username,function(err,userId){
                dao.tokenDao.getToken(userId,function(err,token){
                    callback(null,token,userId);
                });
            });
        },
        function (token,userId,callback) {
            if (token===recievedToken)
                callback(null,true,userId)
             else callback(null, false,userId)
        }
    ], function (err, isValid,userId) {
        if (err) {
            console.log(err);
        }
        if(isValid) {
            dao.userDao.setUserVerified(userId);
            dao.followDao.initiatefollow({userId:userId},function(err,isInitiated){if(err)
            console.log(err);
            })
        }
        return callback(null,isValid);
    });
};


module.exports={
    verify:verify,
    sentMailVerificationLink:sentMailVerificationLink,
    isAuth:isAuth,
    encrypt:encrypt,
    decrypt:decrypt
};