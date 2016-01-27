var mongoose=require('mongoose');
var followSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId,unique:true,ref:'users'},
    following:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    followers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    countFollowers:{type:Number,default:0},
    countFollowing:{type:Number,default:0}
});
module.exports=mongoose.model("follow",followSchema);