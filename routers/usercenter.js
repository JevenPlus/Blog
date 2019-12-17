const user = require("../model/user");

module.exports = (req,res)=>{

    if (req.session.ifLogin){

        user
            .findById(req.session._id)
            .then(data=>{
                res.render("usercenter" , {
                    ifLogin:req.session.ifLogin,
                    data
                });
            });


    }else{
        res.render("usercenter" , {ifLogin:false});
    }



};