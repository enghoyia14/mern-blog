require('dotenv').config();  // Load env variables at the very start
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');  // logging middleware

const app = express();
const port = process.env.PORT || 5006;

// Middleware
app.use(morgan('dev'));     // HTTP request logger
app.use(express.json());    // parse JSON bodies
app.use(cors());            // enable CORS

// Routes
const blogRoutes = require('./src/routes/blog.routes.js');
const commentRoutes = require('./src/routes/comment.route');
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('Hotels Rooftop Server is running....!');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected successfully!");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
