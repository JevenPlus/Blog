
const express = require("express");
const comment = require("../model/comment");
const article = require("../model/article");

let router = express.Router();

//文章评论
router.post("/",(req,res)=>{
    let reqData = req.body;
    if (req.session.ifLogin){

        //存储到评论表 和 文章表
        comment
            .create({
                author : req.session._id
                ,content : reqData.content
            })
            .then(data=>{
                //文章表关联评论
                article
                    .updateOne(
                        {_id:reqData.articleId},
                        {$push:{comment:data._id}}
                    )
                    .then(()=>{
                        res.send({code:0,msg:"评论成功！"});
                    })
                    .catch(e=>{
                        res.send({code:4,msg:"服务器异常~"});
                    });

            })
            .catch(e=>{
                res.send({code:4,msg:"服务器异常~"});
            });


    }else{
        res.send({code:1,msg:"登录过期，请重新登录。"});
    }

    console.log(reqData);
});

//文章评论的评论
router.post("/comment",(req,res)=>{
    let reqData = req.body;
    console.log(reqData);
    if (req.session.ifLogin){
        comment
            .create({
                author : req.session._id
                ,content : reqData.content
            })
            .then(data=>{
                //给一级评论添加关联
                comment
                    .updateOne({_id:reqData._id},{$push:{comment:data._id}})
                    .then(()=>{
                        res.send({code:0,msg:"评论成功"});
                    })
                    .catch(e=>{
                        console.log(e);
                        res.send({code:1,msg:"服务器异常……"});
                    })
            })
            .catch(e=>{
                console.log(e);
                res.send({code:1,msg:"服务器异常……"});
            })
    }else{
        res.send({code:4,msg:"登录超时"});
    }
});

module.exports = router;