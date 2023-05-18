const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'secret';

const User = require('../models/user');

// to generate jwt token from user id
function generateToken(user) {
    return jwt.sign({ id: user._id }, PRIVATE_KEY, {
        expiresIn: 86400, // 24 hours
    });
}

module.exports = {
    signup: async (req, res) => {
        try {
            // console.log(req.body);
            if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) {
                throw new Error("All fields are required");
            }
            if (req.body.password !== req.body.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(req.body.password, salt);

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: passwordHash,
            });

            await user.save();

            // add jwt token as http only cookie
            const token = generateToken(user);

            res.cookie("x-auth-token", token, { httpOnly: true });

            res.status(201).json({ message: "User created successfully" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    },

    login: async (req, res) => {
        try {
            // console.log(req.body);
            if (!req.body.email || !req.body.password) {
                throw new Error("All fields are required");
            }

            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new Error("User not found");
            }

            const isMatch = bcrypt.compareSync(req.body.password, user.passwordHash);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }

            // add jwt token as http only cookie
            const token = generateToken(user);

            res.cookie("x-auth-token", token, { httpOnly: true });

            res.status(200).json({
                message: "User logged in successfully. cookie 'x-auth-token is set. You can also set this token in Authorization header with value 'Bearer <token>'.",
                token: token,
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            // console.log(req.user);
            if (!req.user.id) {
                throw new Error("User not found");
            }

            const user = await User.findByIdAndDelete(req.user.id);

            if (!user) {
                throw new Error("User not found");
            }

            res.clearCookie("x-auth-token");

            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("x-auth-token");

            res.status(200).json({ message: "User logged out successfully" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    },
};