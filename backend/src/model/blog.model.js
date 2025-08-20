const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  content:  {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  coverIMG: String,
  category: String,
  author: {
type:mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
  },
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

