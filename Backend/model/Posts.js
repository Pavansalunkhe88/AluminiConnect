const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Teacher", "Alumni", "Student"],
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorProfileImage: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    url: String,
    public_id: String, // optional image URL or Cloudinary link
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  shares: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

/*

| Route                               | Method     | Description                |
| ----------------------------------- | ---------- | -------------------------- |
| `/api/posts/`                       | **POST**   | Create a new post          |
| `/api/posts/`                       | **GET**    | Get all posts (feed)       |
| `/api/posts/:id`                    | **GET**    | Get a single post          |
| `/api/posts/:id`                    | **DELETE** | Delete post (only owner)   |
| `/api/posts/:id/like`               | **PUT**    | Toggle like/unlike         |
| `/api/posts/:id/comment`            | **POST**   | Add comment                |
| `/api/posts/:id/comment/:commentId` | **DELETE** | Delete comment (if author) |

*/