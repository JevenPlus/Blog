

module.exports = (req,res)=>{
    //清除session
    req.session.destroy();

    //重定向到首页
    res.redirect("/");
};