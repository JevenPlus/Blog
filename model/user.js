
const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//表规则
let userSchema = new Schema({
    user : {
        type:String,
        required:true,
        match : /^[\w\u4e00-\u9fa5]{2,10}$/
    }
    ,pwd : {
        type:String
        ,required:true
        ,match : /^[\da-z_,!@#\$%\^&*()+\[\]{}\-=\.<>?]{6,18}$/i
    }
    ,secret : {
        q : {
            type : String,
            required : true,
            enum : ["0","1","2","3"]
        },
        s : {
            type : String,
            required : true,
            match : /./
        }
    }
    ,sex : {
        type : String
        ,enum : ["男","女"]
    }
    ,tel : {
        type : String
        ,match : /^1[3-9]\d{9}$/
    }
    ,email : {
        type : String
        ,match : /^\w{2,}@[\da-z]{2,}(\.[a-z]{2,6}){1,2}$/i
    }
    ,status : {
        type:String
        ,default:"这人很懒，什么都没留下~"
    }
    ,photo : {
        type:String
        ,default : "default.jpg"
    }
});

//中间件 - 用于加密密码
userSchema.pre("save",function (next) {
    /*console.log("save中间件执行了！");
    console.log(this);*/

    //在被保存到数据库之前，加密pwd
    //加密固定写法，update表示要加密的数据
    this.pwd = crypto.createHash("sha256").update(this.pwd).digest("hex");
    this.secret.s =  crypto.createHash("sha256").update(this.secret.s).digest("hex");
    next();
});


//将表导出
module.exports = mongoose.model("user",userSchema);


