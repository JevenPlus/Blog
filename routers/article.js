
const express = require("express");
const article = require("../model/article");
const comment = require("../model/comment");

let router = express.Router();


//发表文章的
router.post("/",(req,res)=>{
    let reqData = req.body;

    if (req.session.ifLogin){
        article
            .create({
                title : reqData.title,
                tag : reqData.tag,
                content : reqData.content,
                author : req.session._id
            })
            .then(data=>{
                res.send({code:0,msg:"发表成功",id:data._id});
            })
            .catch(e=>{
                res.send({code:2,msg:"服务器异常~"});
            });
    }else {
        res.send({code:4,msg:"登录超时~"});
    }

});

//单独的每个文章的文章页
router.get("/:id",(req,res)=>{
    article
        .findById(req.params.id)
        .populate({
            path:"author",
            select : ["user","_id","photo","status"]
        })
        .populate({
            path:"comment",
            select : ["_id","comment","author","content","date"],
            populate:{
                path:"author comment",
                populate : {
                    path : "author"
                }
            }
        })
        .then(data=>{
            if (data){
                res.render("article",{data});
            }else{
                res.redirect("/404.html");
            }
        })
        .catch(e=>{
            res.redirect("/404.html");
        });
});

//查找文章
router.post("/search",(req,res)=>{
    if (req.session.ifLogin){

        let reqData = req.body;

        let serchData = {};
        if (reqData.srh){
            serchData = {$or:[
                {title:new RegExp(reqData.srh)}
                ,{tag:{$all:[reqData.srh]}}
                ]}
        }

        article
            .find(
                serchData,
                {title:1}
            )
            .then(data=>{
                res.send(data);
            })
            .catch(e=>{
                res.send({code:2,msg:"服务器异常~"});
            });
    }else{
        res.send({code:4,msg:"登录超时"});
    }

});

//删除文章
router.post("/delete",(req,res)=>{
    if (req.session.ifLogin){

        let _id = req.body._id;
        article
            .findById(_id)
            .then(data=>{
                if (!data)return;
                data.comment.forEach(item=>{
                    comment
                        .findById(item)
                        .then(data=>{
                            if (!data)return;
                            data.comment.forEach(item=>{
                                comment
                                    .deleteOne({_id:item})
                                    .then(()=>{})
                            });
                        });
                    comment
                        .deleteOne({_id:item})
                        .then(()=>{});
                });
                article
                    .deleteOne({_id:data._id})
                    .then(()=>{
                        res.send({code:0,msg:"删除成功。"});
                    })
            })
            .catch(e=>{
                res.send({code:4,msg:"登录超时"});
            })


    }else{
        res.send({code:4,msg:"登录超时"});
    }
});

module.exports = router;