
const express = require("express");
const multer = require("multer");
const path = require("path");
const user = require("../model/user");
const fs = require("fs");

let router = express.Router();

////// 头像上传开始
!function(){
    //使用磁盘存储文件 ，指定存储位置和文件名
    let storage = multer.diskStorage({
        //存储目录
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname,"../static/photo"));
        },
        //文件名
        filename: function (req, file, cb) {
            let fileName = req.session._id + file.originalname.match(/(\.(jpe?g|png|gif|webp))$/)[0];
            cb(null, fileName);
        }
    });
    //规定上传的一些参数
    let upload = multer({
        storage: storage, //规定存储方式
        limits : { //规定文件的各种限制
            fileSize:1024*300 //限制大小不超过 300k
        },
        fileFilter(req,file,cb){//文件过滤
            cb(null,/\.(jpe?g|png|gif|webp)$/.test(file.originalname));
        }
    }).single("file");
    //辅助 /photo 路由
    function deletePhoto(_id,ext){
        [".jpg",".png",".jpeg",".gif"].forEach((item)=>{
            if (item === ext)return;
            fs.unlink(path.join(__dirname,"../static/photo",_id+item),()=>{});
        });
    }
    //头像的上传
    router.post("/photo",(req,res)=>{
        //判断登录状态
        if (req.session.ifLogin){
            upload(req, res, function (err) {
                //错误
                if (err){
                    if (err instanceof multer.MulterError){
                        res.send({code:8,msg:err.message});
                    }else{
                        res.send({code:8,msg:"上传失败~"});
                    }
                }else{
                    // 一切都好
                    user
                        .updateOne({_id:req.session._id},{photo:req.file.filename})
                        .then(()=>{
                            //删除之前的头像
                            deletePhoto(
                                req.session._id,
                                req.file.filename.match(/(\.(jpe?g|png|gif|webp))$/)[0]
                            );
                            res.send({code:0,msg:"上传成功"});
                        })
                        .catch(e=>{
                            console.log(e);
                            res.send({code:1,msg:"服务器异常~请稍后重试"})
                        });
                }

            });
        }else{
            res.send({code:4,msg:"登录超时，请重新登录~"});
        }


    });
}();

////// 文章图片的上传
!function(){
    let storage = multer.diskStorage({
        //存储目录
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname,"../static/article"));
        },
        //文件名
        filename: function (req, file, cb) {
            let fileName = `${new Date().getTime()}${Math.ceil(Math.random()*100000)}${ file.originalname.match(/(\.(jpe?g|png|gif|webp))$/)[0]}`;
            cb(null, fileName);
        }

    });
    let upload = multer({
        storage: storage, //规定存储方式
        fileFilter(req,file,cb){//文件过滤
            cb(null,/\.(jpe?g|png|gif|webp)$/.test(file.originalname));
        }
    }).single("file");
    //文章图片
    router.post("/article",(req,res)=>{
        if (req.session.ifLogin){
            upload(req, res, function (err) {
                //错误
                if (err){
                    if (err instanceof multer.MulterError){
                        res.send({code:8,msg:err.message});
                    }else{
                        res.send({code:8,msg:"上传失败~"});
                    }
                }else{
                    res.send({
                        code:0,
                        msg:"上传成功",
                        data : {
                            src : `/article/${req.file.filename}`,
                            title : ""
                        }
                    });
                }
            });
        }else{
            res.send({code:4,msg:"登录超时，请重新登录~"});
        }
    });
}();




module.exports = router;