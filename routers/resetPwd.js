const express = require("express");
const user = require("../model/user");
const crypto = require("crypto");

let router = express.Router();

//为了返回密保问题
router.post("/getInfo",(req,res)=>{
    let reqData = req.body;

    //查找
    user
        .findOne({user:reqData.user})
        .then(data=>{
            if (data){
                res.send({
                    code:0,
                    msg:"查找成功",
                    data:{
                        q : data.secret.q
                    }
                })
            }else{
                //用户不存在
                res.send({code:6,msg:"用户不存在！"});
            }
        })
        .catch(e=>{
            res.send({code:3,msg:"服务器异常~"});
        });

});

//忘记密码之后的修改密码
router.post("/forget",(req,res)=>{
    let reqData = req.body;

    //比对问题答案
    user
        .findOne({user:"阿飞"})
        .then(data=>{
            if (data){
                let s = crypto.createHash("sha256").update(reqData.s).digest("hex");

                if (s === data.secret.s){
                    //密保答案正确
                    user
                        .update(data,{pwd:crypto.createHash("sha256").update(reqData.pwd).digest("hex")})
                        .then(()=>{
                            res.send({code:0,msg:"更新密码成功！"});
                        });
                }else{
                    //密保答案不正确
                    res.send({code:7,msg:"密保答案不正确！"})
                }

            }else{
                res.send({code:6,msg:"用户不存在！"});
            }
        })
        .catch(e=>{
            console.log(e);
            res.send({code:3,msg:"服务器异常~！"});
        });

});

//个人中心里面的修改密码
router.post("/reset",(req,res)=>{
    let reqData = req.body;

    if (req.session.ifLogin){
        //登录未超时

        //超找用户
        user
            .findById(req.session._id)
            .then(data=>{
                if (data){
                    //用户存在
                    //检测原密码是否正确
                    let reqPwd = crypto.createHash("sha256").update(reqData.pwd).digest("hex");
                    if (data.pwd === reqPwd){
                        //原密码正确，直接更新
                        let newPwd = crypto.createHash("sha256").update(reqData.newPwd).digest("hex");
                        user
                            .updateOne({_id:data._id},{pwd:newPwd})
                            .then(()=>{
                                req.session.destroy();
                                res.send({code:0,msg:"更新成功，请重新登录~"});
                            })
                            .catch(e=>{
                                res.send({code:2,msg:"服务器异常~请稍后重试~"});
                            });
                    }else{
                        //原密码错误
                        res.send({code:7,msg:"原密码错误，请重新输入。"});
                    }

                }else{
                    //理论上，不动数据库，这个data是一定存在的，但是为了避免错误，还是要判断一下
                    req.session.destroy();
                    res.send({code:4,msg:"用户不存在，请重新登录~"});
                }
            })
            .catch(e=>{
                res.send({code:2,msg:"服务器异常~请稍后重试~"});
            });

    }else{
        //登录超时
        res.send({code:4,msg:"登录超时，请重新登录~"});
    }
});



module.exports = router;