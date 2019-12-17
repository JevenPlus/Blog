/*
code
    0 登录成功
    1 用户不存在（没注册）
    2 服务器错误
    3 密码错误
 */
const user = require("../model/user");
const crypto = require("crypto");

module.exports = (req,res)=>{
    let reqData = req.body;

    //用过user字段查找，然后进行密码比对
    user
        .findOne({user:reqData.user})
        .then(data=>{
            if (data){ //代表user注册过，继续密码比对
                //对当前传过来的密码进行加密处理
                let pwd = crypto.createHash("sha256").update(reqData.pwd).digest("hex");

                //判断加密后的密码和数据库内容是否一致
                if (data.pwd === pwd){ //密码一致
                    //设置session
                    req.session.ifLogin = true;
                    req.session._id = data._id;

                    res.send({code:0,msg:"登录成功！"});
                }else{ //密码不一致
                    res.send({code:3,msg:"密码错误！"});
                }
            }else{ //代表user没有注册过，返回前端错误信息
                res.send({code:1,msg:"用户未注册！"});
            }
        })
        .catch(()=>{
            res.send({code:2,msg:"服务器异常，请稍后再试~"});
        });
};