/*

| Function        | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `createPost`    | Create a new post                              |
| `getAllPosts`   | Fetch all posts (feed)                         |
| `getPostById`   | Get a single post with comments                |
| `deletePost`    | Allow only the post owner (or admin) to delete |
| `toggleLike`    | Like/unlike a post                             |
| `addComment`    | Add a comment                                  |
| `deleteComment` | Delete own comment (or admin)                  |

*/

const User = require("../model/registerUser/UserScehma");
const Post = require("../model/Posts");
const Alumni = require("../model/Alumni");
const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const Admin = require("../model/Admin");
const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");

// async function handleCreatePost(req, res) {
//   try {
//     const id = req.user.id;
//     const { content } = req.body;

//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Post content cannot be empty." });
//     }

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found." });

//     let imageUrl = null;

//     // Upload image to Cloudinary if present
//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "alumni_posts",
//         transformation: [
//           { width: 1080, height: 1080, crop: "limit", gravity: "auto" },
//           { quality: "auto" },
//         ],
//       });

//       imageUrl = uploadResult.secure_url;
//       publicId = uploadResult.public_id;

//       // Delete local temp file
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     }

//     const post = await Post.create({
//       user: id,
//       content: content.trim(),
//       url: imageUrl,
//       public_id: publicId
//     });

//     res.status(201).json({
//       message: "Post created successfully.",
//       post,
//     });
//   } catch (err) {
//     console.error("ERROR while creating post:", err.message);
//     if (req.file && req.file.path && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ message: "Something went wrong." });
//   }
// }

async function handleCreatePost(req, res) {
  try {
    // Defensive auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const id = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content cannot be empty." });
    }

    // if ((!content || !content.trim()) && !req.file) {
    //   return res.status(400).json({ message: "Post must have text or image." });
    // }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    let imageData = {};

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "alumni_posts",
        transformation: [
          { width: 800, height: 800, crop: "limit", gravity: "auto" },
          { quality: "auto" },
        ],
        resource_type: "auto",
      });

      imageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };

      // Fetch role-based profile image
      let authorProfileImage = null;
      switch (user.role) {
        case "Student":
          authorProfileImage =
            (await Student.findOne({ userId: user._id }))?.profileImage || null;
          break;
        case "Teacher":
          authorProfileImage =
            (await Teacher.findOne({ userId: user._id }))?.profileImage || null;
          break;
        case "Alumni":
          authorProfileImage =
            (await Alumni.findOne({ userId: user._id }))?.profileImage || null;
          break;
        case "Admin":
          authorProfileImage =
            (await Admin.findOne({ userId: user._id }))?.profileImage || null;
          break;
      }

      // Safely delete temp file
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.warn("Failed to clean up temp file:", unlinkErr.message);
      }
    }

    const post = await Post.create({
      user: id,
      role: user.role,
      authorName: user.name,
      authorProfileImage,
      content: content.trim(),
      image: imageData,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (err) {
    console.error("ERROR while creating post:", err.message);

    // Clean up temp file safely
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (unlinkErr) {
      console.warn("Cleanup failed:", unlinkErr.message);
    }

    return res.status(500).json({ message: "Something went wrong." });
  }
}

async function handleGetPostById(req, res) {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID.",
      });
    }

    // Find post by ID
    const post = await Post.findById(id).select("-__v");

    // Handle not found
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Send response
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully.",
      data: post,
    });
  } catch (err) {
    console.error("Error while retrieving post:", err.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving post.",
    });
  }
}

async function handleGetAllPosts(req, res) {
  try {
    // const filter = {};
    // if (req.query.role) filter.role = req.query.role;

    // const posts = await Post.find(filter).sort({ createdAt: -1 });

    const posts = await Post.find().sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found.",
      });
    }

    // const limit = parseInt(req.query.limit) || 10;
    // const page = parseInt(req.query.page) || 1;

    // const posts = await Post.find()
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    res.status(200).json({
      success: true,
      message: "Retrieved all posts successfully.",
      data: posts,
    });
  } catch (err) {
    console.error("Error while retrieving all posts:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving posts.",
    });
  }
}

async function handleDeletePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Authorization check
    if (post.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this post." });
    }

    // Cloudinary image deletion
    if (post.image && post.image.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    // Delete post
    const deletedPost = await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
      data: deletedPost,
    });
  } catch (err) {
    console.error("Error while deleting post:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong while deleting post." });
  }
}


async function handleAddComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid post ID." });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text cannot be empty." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const newComment = { user: userId, text: text.trim() };
    post.comments.push(newComment);

    await post.save();
    await post.populate("comments.user", "name");

    return res.status(200).json({
      success: true,
      message: "Comment added successfully.",
      data: post,
    });
  } catch (err) {
    console.error("Error while adding comment:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong while adding comment." });
  }
}

async function handleDeleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post or comment ID.",
      });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the target comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Authorization check (only owner or admin can delete)
    if (comment.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Remove the comment
    comment.deleteOne(); // marks it for removal
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (err) {
    console.error("Error while deleting a comment:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting comment.",
    });
  }
}

async function handleAddLike(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid post ID." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const alreadyLiked = post.likes.includes(userId);

    const updatedPost = alreadyLiked
      ? await Post.findByIdAndUpdate(
          id,
          { $pull: { likes: userId } },
          { new: true }
        )
      : await Post.findByIdAndUpdate(
          id,
          { $addToSet: { likes: userId } },
          { new: true }
        );

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked successfully." : "Post liked successfully.",
      data: {
        isLiked: !alreadyLiked,
        likeCount: updatedPost.likes.length,
      },
    });
  } catch (err) {
    console.error("Error while liking/unliking post:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}


module.exports = {
  handleCreatePost,
  handleGetPostById,
  handleDeletePost,
  handleAddComment,
  handleGetAllPosts,
  handleDeleteComment,
  handleAddLike,
};
