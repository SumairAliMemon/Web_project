const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate input
        if (!email || !password || !username || !role) {
            return res.status(400).json({
                success: false,
                msg: 'Please provide all required fields'
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: 'User already exists'
            });
        }

        // Create new user with hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        // Save user
        const savedUser = await user.save();

        // Generate a token without expiry
        try {
            const token = jwt.sign(
                { userId: savedUser._id, role: savedUser.role },
                process.env.JWT_SECRET
            );

            return res.status(201).json({
                success: true,
                token,
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role
                }
            });

        } catch (jwtError) {
            console.error('JWT Sign Error:', jwtError);
            // Delete the saved user if token creation fails
            await User.findByIdAndDelete(savedUser._id);
            throw new Error('Token generation failed');
        }

    } catch (error) {
        console.error('Registration Error:', error.message);
        return res.status(500).json({
            success: false,
            msg: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
