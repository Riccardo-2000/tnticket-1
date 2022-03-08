const jwt = require('jsonwebtoken');
module.exports = async (req ,res,next)=> {

    try {
        const token = req.headers.authorization.split(' ')[1].toString();
        const decoded = jwt.verify(token.toString(), 'secret');
        const userId = decoded.userId;
        if (userId) {
            next();
        }
    } catch (error) {
        res.status(401).json({
            message:"Auth Failed"
        })
    }

}
