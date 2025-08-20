const express = require('express');
const Comment = require('../model/comment.model'); // Ensure path is correct and capital C

const router = express.Router();

// Create a comment
router.post('/post-comment', async (req, res) => {
  try {
    console.log(req.body);

    const newComment = new Comment(req.body);
    await newComment.save();

    res.status(200).send({
      message: "Comment created successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("An error occurred while posting new comment", error);
    res.status(500).send({
      message: "An error occurred while posting new comment",
      error: error.message
    });
  }
});

// Get total comments count
router.get("/total-comments", async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({});
    res.status(200).send({ message: "Total comments count", totalComments });
  } catch (error) {
    console.error("An error occurred while getting comment count", error);
    res.status(500).send({
      message: "An error occurred while getting comment count",
      error: error.message
    });
  }
});

module.exports = router;

