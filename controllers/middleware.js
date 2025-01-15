const jwt = require('jsonwebtoken');

const User = require('../models/user');

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'secret';

module.exports = {
    // this function will be used as middleware in routes to prevent unauthorized access
    protect: async (req, res, next) => {
        try{

            // this is just to make sure that authorization header is not empty becoz if it is empty then split will throw error
            if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
                req.headers.authorization = ' ';
            }

            const token = req.cookies['x-auth-token'] || req.headers.authorization.split(' ')[1];

            if (!token) {
                throw new Error("You need to login");
            }

            const decoded = jwt.verify(token, PRIVATE_KEY);
            const user = await User.findById(decoded.id, '-passwordHash');

            if (!user) {
                throw new Error("User not found");
            }

            // setting user in req object
            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    }
}