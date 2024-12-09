const User = require("../models/Users");
const bcrypt = require("bcryptjs");  // bcrypt for password hashing and comparison
const jwt = require("jsonwebtoken");  // jwt for token generation

// Register method
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);  // Salt rounds (10 is a commonly used number)
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = new User({
      name,
      email,
      passwordHash,  // Save the hashed password
      role,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login method
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);  // Compare with passwordHash
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Payload with user ID and role
      process.env.JWT_SECRET,             // Secret key for JWT generation
      { expiresIn: '20h' }                // Token expiration time (1 hour)
    );

    // Send response with the user data (excluding password) and token
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
