import React from 'react';
import Footer from '../../components/layout/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose max-w-none prose-blue">
          <p className="text-gray-500 mb-6">Last Updated: March 2026</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">By accessing or using the AlumniConnect platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the Service.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Platform Usage & Conduct</h2>
          <p className="text-gray-700 mb-4">Users must conduct themselves professionally. The platform is intended for networking, mentorship, and academic communication. Harassment, spam, or sharing inappropriate content will result in immediate account suspension.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Integrity</h2>
          <p className="text-gray-700 mb-4">You are responsible for safeguarding your login credentials. Falsifying your identity, such as using a fake PRN or Employee ID, is strictly prohibited and accounts flagged for such behavior will be blocked.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Content Ownership</h2>
          <p className="text-gray-700 mb-4">You retain all rights to any content you submit, post, or display on or through the Service. By posting content, you grant us a license to use, modify, and display the content solely for the purpose of operating the platform.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Administrative Rights</h2>
          <p className="text-gray-700 mb-4">The university administration reserves the right to modify or terminate user accounts that violate these terms or pose a security risk to the community.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
