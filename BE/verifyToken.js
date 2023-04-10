const jwt = require("jsonwebtoken")

const verifyToken = (req, res ,next )=>{
    const token = req.headers.authentication;
    if(token){
        jwt.verify(token,process.env.JWT_SEC, (err, user) => {
            if(err)
            {
                res.status(403).json("Token is not valid");
                req.user = user;
                next();
            }
        });
    }else {
        return res.status(401).json("Unauthorization")
    }
}
const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else
        {
            res.status(403).json("you are not alow to that!")
        }
    })
}
module.exports = {verifyToken,verifyTokenAndAuthorization};