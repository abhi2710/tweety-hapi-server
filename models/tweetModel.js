/**
 * Created by abhinav on 1/25/2016.
 */
var mongoose=require('mongoose');
var tweetSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,required:true,ref:'users'},
    tweet_text:{type:String,required:true},
    time:{type:Date,required:true,default:new Date()}
});
module.exports=mongoose.model("tweet",tweetSchema);

