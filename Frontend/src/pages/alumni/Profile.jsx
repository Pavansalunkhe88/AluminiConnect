import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-2xl w-[90%] md:w-[60%] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
          <div className="absolute -bottom-10 left-10 flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold border-4 border-white">
              PS
            </div>
            <div className="ml-4 text-white">
              <h2 className="text-xl font-semibold">Pavan Salunkhe</h2>
              <p className="text-sm">Class of 2022</p>
            </div>
          </div>
          <button className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium">
            Edit Profile
          </button>
        </div>

        {/* Main Info */}
        <div className="mt-14 px-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Current Position</h3>
              <p className="text-gray-800 font-medium">Final Year IT</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Location</h3>
              <p className="text-gray-800 font-medium">Pune</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-gray-500 text-xs font-semibold uppercase">Bio</h3>
              <p className="text-gray-800 font-medium">Java , Javscript , nodejs</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex justify-around border-t py-5 bg-gray-50">
          <div className="text-center">
            <p className="text-blue-600 font-bold text-lg">300</p>
            <p className="text-gray-600 text-sm">Connections</p>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-bold text-lg">10</p>
            <p className="text-gray-600 text-sm">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-purple-600 font-bold text-lg">3k</p>
            <p className="text-gray-600 text-sm">Profile Views</p>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 w-[90%] md:w-[60%] space-y-6">
        {/* Skills Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "MongoDB", "Express.js", "AWS", "Java","JavaScript"].map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Projects</h3>
          <ul className="space-y-3">
            <li>
              <p className="font-medium text-gray-900">KarmBhoomi: Hyperlocal Volunteering Platform</p>
              <p className="text-gray-600 text-sm">Offline-first web app for volunteering and crisis response.</p>
            </li>
            <li>
              <p className="font-medium text-gray-900">Automatic Door Opener using Arduino IoT</p>
              <p className="text-gray-600 text-sm">IoT-based project for contactless door automation.</p>
            </li>
            <li>
              <p className="font-medium text-gray-900">Portfolio Website</p>
              <p className="text-gray-600 text-sm">Built a personal portfolio using React and Tailwind CSS.</p>
            </li>
          </ul>
        </div>

        {/* Achievements Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Achievements</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Winner of Intercollege Hackathon 2024</li>
            <li>Certified AWS Cloud Practitioner</li>
            <li>3rd Place in National Coding Championship</li>
            <li>Developed 10+ projects on GitHub</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
