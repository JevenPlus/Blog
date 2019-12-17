
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//表规则
let articleSchema = new Schema({
    //标题
    title : {type:String,required:true},
    //分类
    tag : {type:Array,default:["未分类"]},
    //内容
    content : {type:String,required:true},
    //作者
    author : {type:Schema.Types.ObjectId,required:true,ref:"user"},
    //时间
    date : {type:Date,default:Date.now},
    //评论
    comment : [{type:Schema.Types.ObjectId,ref:"comment"}],
    //浏览量
    pageviews : {type:Number,default:0}
});

//将表导出
module.exports = mongoose.model("article",articleSchema);


