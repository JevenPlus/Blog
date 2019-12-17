
//引入包
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const mongoSession = require("connect-mongo")(session);

//启动数据库服务
mongoose
    .connect("mongodb://localhost:27017/58blog",{useNewUrlParser:true})
    .then(()=>{console.log("数据库连接成功")})
    .catch(()=>{console.log("数据库连接失败")});

//创建app
let app = express();
app.listen(8888,(err)=>{
    if(!err) console.log("服务启动，端口8888");
});

//默认中间件
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/static")));
//session中间件
app.use(session({
    secret : "afei",//密钥 , 可以设置任意字符串
    cookie : {maxAge:20*60*1000},//设置cookie的过期时间 ms
    rolling : true,//是否每次请求（链接跳转，直接访问，ajax，……），都重新刷新存储时间
    store : new mongoSession({
        url : "mongodb://localhost:27017/58blog"
    }), //不设置store的话session默认存储在服务器内存，设置store讲session数据存储到数据库

    resave : false, //重新存储session
    saveUninitialized : false //初始值
}));

//设置模板引擎
app.set("view engine" , "ejs");

//路由监听
//根路由
app.use("/",require("./routers/index"));
//注册路由
app.post("/regist",require("./routers/regist"));
//登录路由
app.post("/login",require("./routers/login"));
//个人中心
app.get("/usercenter",require("./routers/usercenter"));
app.post("/usercenter",require("./routers/postUsercenter"));
//退出登录
app.get("/loginout",require("./routers/loginout"));
//更新个人信息
app.post("/update",require("./routers/update"));
//修改密码/找回密码
app.use("/resetPwd",require("./routers/resetPwd"));
//上传
app.use("/upload",require("./routers/upload"));
//文章
app.use("/article",require("./routers/article"));
app.use("/article.html",require("./routers/articleHtml"));
//评论
app.use("/comment",require("./routers/comment"));