import React from 'react';
import Footer from '../../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose max-w-none prose-blue">
          <p className="text-gray-500 mb-6">Last Updated: March 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">We collect information that you manually provide when registering for an AlumniConnect account, including your PRN, Full Name, Email Address, and Department. For Teacher accounts, we collect Employee IDs.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">The information provided is strictly used to authenticate your identity against the college database, allow you to connect with other verified members, and broadcast official university announcements to you.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing and Security</h2>
          <p className="text-gray-700 mb-4">Your personal email and phone number are kept private by default and will not be shared with third parties. Your public profile data (Graduation year, Job title, Skills) will be visible to other verified platform users.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
          <p className="text-gray-700 mb-4">We use JWT HTTP-Only cookies to maintain your login session securely. We do not use third-party tracking or advertising cookies.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Account Deletion</h2>
          <p className="text-gray-700 mb-4">You may request to permanently delete your account by contacting the administration via the Contact Us page. Deleting your account will remove your profile entirely from the directory.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
