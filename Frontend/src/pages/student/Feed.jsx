import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';

const StudentFeed = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Feed</h1>
      
      <div className="space-y-4">
        <Card>
          <h2 className="text-xl font-semibold mb-2">Welcome to the Feed, {user?.name}!</h2>
          <p className="text-gray-600">Stay updated with latest posts and announcements from your network.</p>
        </Card>

        {/* Feed content will go here */}
        <Card>
          <h3 className="font-semibold mb-2">Recent Posts</h3>
          <p className="text-gray-600">No posts yet. Check back soon!</p>
        </Card>
      </div>
    </div>
  );
};

export default StudentFeed;
