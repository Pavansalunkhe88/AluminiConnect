import React, { useState } from "react";
import { Card } from "./Card";

const FeedPost = ({
  post,
  onLike,
  onComment,
  onDeletePost,
  onDeleteComment,
  currentUser,
}) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment("");
    }
  };

  console.log("comment.user:", comment._id);
  console.log("currentUser._id:", currentUser._id);
  console.log("currentUser.role:", currentUser.role);

  return (
    <Card className="p-4 mb-4 hover:shadow-lg transition-shadow">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <img
          src={
            post.authorProfileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              post.authorName
            )}`
          }
          alt={post.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>

        {/* DELETE BUTTON */}
        {(String(post.user?._id) ===
          String(currentUser._id) ||
          currentUser.role === "Admin") && (
          <button
            onClick={() => onDeletePost(post._id)}
            className="text-red-500 text-sm hover:underline ml-auto"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600">{post.content}</p>
        {post.image?.url && (
          <img
            src={post.image.url}
            alt="Post"
            className="mt-3 rounded-lg w-full object-cover max-h-96"
          />
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-2 my-2">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            post.isLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <span>{post.isLiked ? "❤️" : "🤍"}</span>
          <span>{post.likes?.length || 0} Likes</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <span>💬</span>
          <span>{post.comments?.length || 0} Comments</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <span>↗️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          {/* <div className="space-y-3">
            
            {post.comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-gray-900">{comment.author.name}</h5>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div> */}

          <div className="space-y-3">
            {post.comments?.length > 0 ? (
              post.comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=User`}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-900">
                        {comment.user.name || "User"}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>

                      {/* COMMENT DELETE */}
                      {(String(comment?.user?._id) === String(currentUser._id) ||
                        currentUser.role === "Admin") && (
                        <button
                          onClick={() => onDeleteComment(post._id, comment._id)}
                          className="text-red-400 text-xs hover:underline ml-2"
                        >
                          delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FeedPost;
