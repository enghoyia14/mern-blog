 const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model'); // ✅ Add this


// ✅ Create a blog post
router.post("/create-post", async (req, res) => {
  try {
    // console.log
    const newPost = new Blog({ ...req.body , author: req.userId,});
    console.log("New blog post received:", req.body);

    await newPost.save();
    res.status(201).send({
      message: "Post created successfully",
      post: newPost
    });
  } catch (error) {
    console.error("Error creating post: ", error);
    res.status(500).send({ message: "Error creating post" });
  }
});

// ✅ Get all blog posts with optional filters
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    if (category) query.category = category;
    if (location) query.location = location;

    const posts = await Blog.find(query).populate('author', 'email' ).sort({ createdAt: -1 });
    res.status(200).send({
      message: "All posts retrieved successfully",
      posts
    });
  } catch (error) {
    console.error("Error retrieving posts: ", error);
    res.status(500).send({ message: "Error retrieving posts" });
  }
});

// ✅ Get a single blog post by ID + related comments
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId }).populate('user', "username email");

    res.status(200).send({
      message: "Post retrieved successfully",
      post,
      comments
    });
  } catch (error) {
    console.error("Error fetching single post: ", error);
    res.status(500).send({ message: "Error fetching post" });
  }
});

// ✅ Update a blog post
router.patch("/update-post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send({
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    res.status(500).send({ message: "Error updating post" });
  }
});

// ✅ Delete a blog post and related comments
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    await Comment.deleteMany({ postId }); // ✅ Fixed

    res.status(200).send({
      message: "Post and related comments deleted successfully",
      post
    });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).send({ message: "Error deleting post" });
  }
});

// ✅ Related blog posts
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ message: "Post not found" });
    }

    const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

    const relatedQuery = {
      _id: { $ne: id }, // Exclude current blog
      title: { $regex: titleRegex }
    };

    const relatedPost = await Blog.find(relatedQuery);

    res.status(200).send({
      message: "Related posts retrieved successfully",
      related: relatedPost
    });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    res.status(500).send({ message: "Error fetching related posts" });
  }
});

module.exports = router;
