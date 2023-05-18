const jwt = require('jsonwebtoken');

const User = require('../models/user');

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'secret';

module.exports = {
    protect: async (req, res, next) => {
        try{
            const token = req.cookies['x-auth-token'];

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