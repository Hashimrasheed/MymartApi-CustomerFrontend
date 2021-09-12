const jwt = require('jsonwebtoken');
const { JWT_KEY } = require("../../config/constant");

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, JWT_KEY);
        req.customerData = decoded.data;
        // console.log('req.customerData', req.customerData);
        next();
    }catch(error){

        return res.status(401).json({
            error:error.message,
            token: req.headers.authorization,
            message: "Auth Failed"
        });
    }
};