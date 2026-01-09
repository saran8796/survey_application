import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, fullName } = req.body;

    try {
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        let user = new User({
            username,
            email,
            password,
            fullName
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Check if input is email or username
        let user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
        
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
