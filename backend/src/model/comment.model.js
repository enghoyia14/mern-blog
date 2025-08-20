const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
 user: {
    type: mongoose.Schema.Types.ObjectId,
   ref: "User",  // Make sure this matches your User model name
   required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",  // Make sure this matches your Blog model name
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
