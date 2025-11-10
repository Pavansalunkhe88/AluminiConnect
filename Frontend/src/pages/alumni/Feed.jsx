import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CreatePost from '../../components/ui/CreatePost';
import FeedPost from '../../components/ui/FeedPost';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Job Openings at TechCorp',
      content: 'We have multiple positions open for software engineers with 3-5 years of experience. Great opportunity for recent graduates. DM me for referrals.',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson',
        role: 'alumni',
        company: 'TechCorp',
        batch: '2020'
      },
      timestamp: '3 hours ago',
      likes: 42,
      isLiked: true,
      comments: [
        {
          author: { name: 'Sarah Chen', avatar: null },
          content: 'Are there any positions for fresh graduates?',
          timestamp: '2 hours ago'
        },
        {
          author: { name: 'Alex Thompson', avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson' },
          content: 'Yes, we have entry-level positions too. Send me your resume!',
          timestamp: '1 hour ago'
        }
      ],
      tags: ['jobs', 'careers', 'technology']
    },
    {
      id: 2,
      title: 'Alumni Mentorship Initiative',
      content: 'Excited to announce our new mentorship program. Looking for alumni mentors to guide current students in their career paths. Share your experience and give back to our community.',
      author: {
        name: 'Alumni Relations Office',
        avatar: 'https://ui-avatars.com/api/?name=Alumni+Relations',
        role: 'department'
      },
      timestamp: '1 day ago',
      likes: 75,
      isLiked: false,
      comments: [
        {
          author: { name: 'Michael Wong', avatar: null },
          content: 'Count me in! Happy to mentor students in the fintech domain.',
          timestamp: '20 hours ago'
        }
      ],
      tags: ['mentorship', 'guidance', 'community']
    },
    {
      id: 3,
      title: 'Success Story: Startup Journey',
      content: 'Thrilled to share that my startup just secured Series A funding! Looking to hire interns from our college. Will be conducting a workshop next month to share my entrepreneurship journey.',
      author: {
        name: 'Priya Sharma',
        avatar: null,
        role: 'alumni',
        company: 'InnovateX',
        batch: '2018'
      },
      timestamp: '2 days ago',
      likes: 156,
      isLiked: false,
      comments: [
        {
          author: { name: 'Career Services', avatar: null },
          content: 'Congratulations! Looking forward to the workshop.',
          timestamp: '1 day ago'
        }
      ],
      tags: ['startup', 'success', 'entrepreneurship']
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
          role: 'alumni',
          company: user.company,
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

export default Feed;