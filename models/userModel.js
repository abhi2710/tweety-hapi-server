/**
 * Created by abhinav on 1/19/2016.
 */
var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({

    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:Number,required:true},
    isVerified:{type:Boolean,required:true,default:false},
    accessToken:{type:String},
    array:{type:Array}
});
module.exports=mongoose.model("users",userSchema);

