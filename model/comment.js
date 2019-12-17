
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//表规则
let commentSchema = new Schema({
    author : {type:Schema.Types.ObjectId,required:true,ref:"user"}
    ,date : {type:Date,default:Date.now}
    ,content : {type:String,required:true}
    ,comment : [{type:Schema.Types.ObjectId,ref:"comment"}]
});

//将表导出
module.exports = mongoose.model("comment",commentSchema);


