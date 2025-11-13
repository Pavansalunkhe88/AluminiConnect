import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CreatePost from '../../components/ui/CreatePost';
import FeedPost from '../../components/ui/FeedPost';

const StudentFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Welcome to Alumni Connect!',
      content: 'Welcome to our alumni network! This platform connects students, alumni, and faculty to share knowledge, opportunities, and experiences. Feel free to post questions, share achievements, or connect with alumni in your field.',
      author: {
        name: 'Alumni Connect Team',
        avatar: 'https://ui-avatars.com/api/?name=Alumni+Connect',
        role: 'department'
      },
      timestamp: '1 day ago',
      likes: 25,
      isLiked: false,
      comments: [
        {
          author: { name: 'Sarah Johnson', avatar: null },
          content: 'Excited to be part of this community!',
          timestamp: '20 hours ago'
        }
      ],
      tags: ['welcome', 'community', 'networking']
    },
    {
      id: 2,
      title: 'Internship Opportunities at TechCorp',
      content: 'We have summer internship positions available for computer science students. Great opportunity to work on real projects and learn from experienced professionals. Apply by March 15th!',
      author: {
        name: 'Rahul Sharma',
        avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma',
        role: 'alumni',
        company: 'TechCorp',
        batch: '2020'
      },
      timestamp: '2 days ago',
      likes: 42,
      isLiked: true,
      comments: [
        {
          author: { name: 'Priya Patel', avatar: null },
          content: 'This sounds amazing! Can you share more details about the application process?',
          timestamp: '1 day ago'
        },
        {
          author: { name: 'Rahul Sharma', avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma' },
          content: 'Sure! Check the company website or DM me for details.',
          timestamp: '1 day ago'
        }
      ],
      tags: ['internship', 'jobs', 'technology']
    },
    {
      id: 3,
      title: 'Study Group for Data Structures',
      content: 'Forming a study group for Data Structures and Algorithms. Meeting every Tuesday at 6 PM in the library. All levels welcome! Let me know if you\'re interested.',
      author: {
        name: 'Alex Chen',
        avatar: null,
        role: 'student',
        batch: '2025'
      },
      timestamp: '3 days ago',
      likes: 18,
      isLiked: false,
      comments: [
        {
          author: { name: 'Maria Garcia', avatar: null },
          content: 'Count me in! I\'m struggling with graphs.',
          timestamp: '2 days ago'
        }
      ],
      tags: ['study-group', 'dsa', 'academics']
    }
  ]);

  const handleCreatePost = (newPost) => {
    setPosts([
      {
        id: Date.now(),
        ...newPost,
        author: {
          name: user.name,
          avatar: user.avatar,
          role: 'student',
          batch: user.batch
        },
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
        comments: []
      },
      ...posts
    ]);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              author: { name: user.name, avatar: user.avatar },
              content: comment,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <CreatePost onSubmit={handleCreatePost} />
      </div>
      <div>
        {posts.map(post => (
          <FeedPost
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={(comment) => handleComment(post.id, comment)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentFeed;
