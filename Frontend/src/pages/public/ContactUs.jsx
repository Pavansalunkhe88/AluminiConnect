import React, { useState } from 'react';
import Footer from '../../components/layout/Footer';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">Get in touch with the AlumniConnect administration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            {submitted ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200">
                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                <p>Thank you for reaching out. Our support team will respond to your email shortly.</p>
              </div>
            ) : (
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option>General Inquiry</option>
                    <option>Account Verification Issue</option>
                    <option>Report a Bug</option>
                    <option>Partnership/Sponsorship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
                  Submit Request
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-gray-600">Experiencing issues with your account or finding a bug? Reach out directly via phone or email.</p>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>📧 support@alumniconnect.edu</p>
                <p>📞 +1 (555) 123-4567</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Administration Office</h3>
              <p className="text-gray-600">For offline alumni registration queries, visit the campus IT office.</p>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>Building 4, Room 402</p>
                <p>Monday - Friday: 9am - 5pm</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
