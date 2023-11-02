const contentType = (req,res,next)=>{
    if(req.method ==="PUT"||req.method ==="POST"){
        if(req.headers["content-type"]&&req.headers["content-type"]==="application/json")
        next();
        else
        return res.status(400).send({errorCode:4444,message:"please provide the data in JSON format"})

    }else{
        return res.status(400).send({errorCode:4444,message:"please provide the data in JSON format"})
    }
}

module.exports = contentType