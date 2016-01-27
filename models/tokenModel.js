/**
 * Created by abhinav on 1/20/2016.
 */
var mongoose=require('mongoose');
var registerTokenSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,required:true,unique:true,ref:'users'},
    token:{type:String,required:true}
});
module.exports=mongoose.model("registerTokens",registerTokenSchema);