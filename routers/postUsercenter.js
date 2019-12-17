
module.exports = (req,res)=>{

    let code = req.session.ifLogin?0:1;

    res.send({code});


};