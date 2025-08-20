const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

// ✅ Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists!' });
    }

    const user = new User({ email, password, username });
    await user.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Failed to register", error);
    res.status(500).json({ message: 'Registration failed!' });
  }
});

// ✅ Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ message: 'Login failed! Try again' });
  }
});

// ✅ Logout a user
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Failed to log out", error);
    res.status(500).json({ message: 'Logout failed!' });
  }
});

// ✅ Get all users (excluding password)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ message: "Users found successfully", users });
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: 'Failed to fetch users!' });
  }
});

// ✅ Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    res.status(200).send({ message: "User deleted successfully!" });

  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ message: 'Error deleting user!' });
  }
});

// ✅ Update user role
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User role updated successfully!' });
  } catch (error) {
    console.error("Error updating user role", error);
    res.status(500).json({ message: 'Error updating user role!' });
  }
});

module.exports = router;
