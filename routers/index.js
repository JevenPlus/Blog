const express = require("express");
const path = require("path");
const article = require("../model/article");
const cheerio = require("cheerio");

let router = express.Router();

//首页
router.get("/", (req, res) => {
    article
        .find({}, {}, {
                sort: {pageviews: -1},
                limit: 4,
                skip: 0
            }
        )
        .then(data => {
            let Data = [];
            data.forEach(item=>{

                let $ = cheerio.load(`<div id="afei">${item.content}</div>`);
                Data.push({
                    title : item.title
                    ,content : $("#afei").text()
                    ,author : item.author
                    ,date : item.date
                    ,pageviews: item.pageviews
                    ,comment : item.comment
                    ,tag : item.tag
                    ,_id : item._id
                });
            });
            res.render("index", {data:Data});
        });
});

//favicon.ico
router.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/icon.png"));
});

//用来初始检测登录状态的
router.post("/iflogin", (req, res) => {
    if (req.session.ifLogin) {
        res.send({code: 0});
    } else {
        res.send({code: 1});
    }
});


module.exports = router;