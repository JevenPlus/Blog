/*
返回数据的描述
    code：Number
        0 成功
        1 失败，验证出错
        2 失败，服务器异常
        ……
    msg：String
        文本信息
 */

const user = require("../model/user");


module.exports =  (req,res) => {
    //得到前端传过来的数据
    let reqData = req.body;

    //检测该用户名是否存在于数据库中
    user
        .findOne({user:reqData.user})
        .then(data=>{
            //判断data是否存在
            if (data){//存在
                res.send({code:1,msg:"用户名已经存在"});
            }else{//不存在

                //密码是否一致的判断
                if (reqData.pwd === reqData.pwd2){//密码一致

                    //存储到数据库
                    user
                        .create({
                            user : reqData.user
                            ,pwd : reqData.pwd
                            ,secret : {
                                q : reqData.q,
                                s : reqData.s
                            }
                        })
                        .then(data=>{//存储成功
                            //设置session
                            req.session.ifLogin = true;
                            req.session._id = data._id;

                            res.send({code:0,msg:"注册成功"});
                        })
                        .catch(()=>{//存储失败
                            res.send({code:2,msg:"服务器异常，请重试╥﹏╥"});
                        });

                }else{//密码不一致
                    res.send({code:1,msg:"两次密码不一致"});
                }

            }
        })
        .catch(()=>{
            res.send({code:2,msg:"服务器异常，请稍后再试~"});
        });
};