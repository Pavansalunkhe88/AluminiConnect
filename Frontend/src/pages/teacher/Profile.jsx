import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';

const TeacherProfile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Profile</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {user?.name || 'N/A'}</p>
            <p><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
            <p><span className="font-semibold">PRN Number:</span> {user?.prn_number || 'N/A'}</p>
            <p><span className="font-semibold">Role:</span> {user?.role || 'Teacher'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Department:</span> N/A</p>
            <p><span className="font-semibold">Subject:</span> N/A</p>
            <p><span className="font-semibold">Experience:</span> N/A</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <p className="text-gray-600">Profile editing functionality coming soon.</p>
        </Card>
      </div>
    </div>
  );
};

export default TeacherProfile;
