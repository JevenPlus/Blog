
const article = require("../model/article");


/*for (let i=0;i<40;i++){
    article
        .create({
            title : "测试"+i,
            content : "随便写点啥"+i+i,
            //分类
            tag : ["x"],
            //作者
            author : "5d53aba887b9652a30c3c232",
        })
}*/


const express = require("express");

let router = express.Router();

router.get("/",(req,res)=>{
    article
        .find()
        .then(data=>{
            let len = data.length;
            res.render("all",{len});
        });
});

router.post("/",(req,res)=>{
    let reqData = req.body;
    console.log(reqData);
    article
        .find({},{},{skip:reqData.skip-0,limit:req.body.limit-0})
        .then(data=>{
            res.send(data);
        })
        .catch(()=>{res.send({})});
});

module.exports = router;