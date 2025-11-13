import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CreatePost from "../../components/ui/CreatePost";
import FeedPost from "../../components/ui/FeedPost";

const Feed = () => {
  const { user } = useAuth();
  //const [posts, setPosts] = useState([
  //   {
  //     id: 1,
  //     title: "Student Performance Analytics",
  //     content:
  //       "End of semester performance analytics are now available in the faculty portal. Please review and submit your feedback by the end of this week.",
  //     author: {
  //       name: "Academic Affairs",
  //       avatar: "https://ui-avatars.com/api/?name=Academic+Affairs",
  //       role: "department",
  //     },
  //     timestamp: "2 hours ago",
  //     likes: 15,
  //     isLiked: false,
  //     comments: [
  //       {
  //         author: { name: "Dr. James Wilson", avatar: null },
  //         content: "Has the comparative analysis been included this time?",
  //         timestamp: "1 hour ago",
  //       },
  //     ],
  //     tags: ["academics", "performance", "analysis"],
  //   },
  //   {
  //     id: 2,
  //     title: "Faculty Development Workshop",
  //     content:
  //       "Join us for a two-day workshop on integrating technology in classroom teaching. Experts from leading universities will be conducting sessions.",
  //     author: {
  //       name: "Faculty Development Cell",
  //       avatar: "https://ui-avatars.com/api/?name=Faculty+Development",
  //       role: "department",
  //     },
  //     timestamp: "5 hours ago",
  //     likes: 28,
  //     isLiked: true,
  //     comments: [],
  //     tags: ["workshop", "development", "technology"],
  //   },
  //   {
  //     id: 3,
  //     title: "Research Collaboration Opportunity",
  //     content:
  //       "Looking for faculty members interested in a collaborative research project on sustainable energy. Project duration: 6 months.",
  //     author: {
  //       name: "Dr. Sarah Chen",
  //       avatar: null,
  //       role: "teacher",
  //     },
  //     timestamp: "1 day ago",
  //     likes: 22,
  //     isLiked: false,
  //     comments: [
  //       {
  //         author: { name: "Prof. Mark Johnson", avatar: null },
  //         content: "Interested in joining. What are the focus areas?",
  //         timestamp: "20 hours ago",
  //       },
  //     ],
  //     tags: ["research", "collaboration", "sustainability"],
  //   },
  // ]);

  // const handleCreatePost = (newPost) => {
  //   setPosts([
  //     {
  //       id: Date.now(),
  //       ...newPost,
  //       author: {
  //         name: user.name,
  //         avatar: user.avatar,
  //         role: 'teacher'
  //       },
  //       timestamp: 'Just now',
  //       likes: 0,
  //       isLiked: false,
  //       comments: []
  //     },
  //     ...posts
  //   ]);
  // };

  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/post", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const res = await axios.post("http://localhost:4000/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Post created:", res.data);
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err.response?.data || err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/post/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { isLiked, likes } = res.data;

      // Update frontend state based on correct response
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes, isLiked } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err.response?.data || err.message);
    }
  };

  // const handleComment = (postId, comment) => {
  //   setPosts(
  //     posts.map((post) => {
  //       if (post._id === postId) {
  //         return {
  //           ...post,
  //           comments: [
  //             ...post.comments,
  //             {
  //               author: {
  //                 name: post.authorName,
  //                 avatar: post.authorProfileImage,
  //               },
  //               content: comment,
  //               timestamp: "Just now",
  //             },
  //           ],
  //         };
  //       }
  //       return post;
  //     })
  //   );
  // };

  const handleComment = async (postId, commentText) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/post/${postId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedComments = res.data.comments;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        )
      );

      //setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
    } catch (err) {
      console.error(
        "Error commenting on post:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/post/${postId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: res.data.comments } : post
        )
      );
    } catch (err) {
      console.error(
        "Error deleting comment:",
        err.response?.data || err.message
      );
    }
  };

  // const handleLike = (postId) => {
  //   setPosts(
  //     posts.map((post) => {
  //       if (post.id === postId) {
  //         return {
  //           ...post,
  //           likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  //           isLiked: !post.isLiked,
  //         };
  //       }
  //       return post;
  //     })
  //   );
  // };

  // const handleComment = (postId, comment) => {
  //   setPosts(
  //     posts.map((post) => {
  //       if (post.id === postId) {
  //         return {
  //           ...post,
  //           comments: [
  //             ...post.comments,
  //             {
  //               author: { name: user.name, avatar: user.avatar },
  //               content: comment,
  //               timestamp: "Just now",
  //             },
  //           ],
  //         };
  //       }
  //       return post;
  //     })
  //   );
  // };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <CreatePost onSubmit={handleCreatePost} />
      </div>
      <div>
        {posts.map((post) => (
          <FeedPost
            key={post._id}
            post={post}
            onLike={() => handleLike(post._id)}
            onComment={(comment) => handleComment(post._id, comment)}
            onDeletePost={handleDeletePost}
            onDeleteComment={handleDeleteComment}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
