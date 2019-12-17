/*
code
    0 成功

    4 失败，登录超时
 */
const user = require("../model/user")
module.exports = (req,res)=>{
    let reqData = req.body;

    if (req.session.ifLogin){

        //先处理好需要更新的数据
        let newData = {
            tel : reqData.tel,
            email : reqData.email,
            status : reqData.status
        };
        reqData.sex && (newData.sex = reqData.sex);

        //直接更新数据
        user
            .updateOne({_id:req.session._id}, newData)
            .then(()=>{
                res.send({code:0,msg:"更新成功！"});
            })
            .catch((err)=>{
                console.log(err);
                res.send({code:2,msg:"更新失败~服务器异常，请稍后重试~"})
            });

    }else{
        res.send({code:4,msg:"登录超时，请重新登录~"})
    }


};