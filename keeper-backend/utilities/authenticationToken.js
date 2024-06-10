const jwt = require("jsonwebtoken");
require("dotenv").config();
function authenticationToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token){
        console.log(req.headers.authorization)
        // return res.sendStatus(401);
        }

    try{

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("decoded: " , decoded.user);
            // if (error){
            //     return res.sendStatus(401);
            // }   
            const user = decoded.user;
            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        }catch(error){
            console.error("Error verifying token:", error); // Debugging line
            res.status(403).json({ message: 'Invalid token' });
        }
    
}

module.exports = authenticationToken;