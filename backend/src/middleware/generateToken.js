const jwt = require('jsonwebtoken');
const User = require('../model/user.model');  // Correct path based on your folders
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async (userId) => {
  try {
    // Fetch user from DB by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create token payload and sign token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  } catch (error) {
    console.error("Error generating token", error);
    throw error;
  }
};

module.exports = generateToken;

