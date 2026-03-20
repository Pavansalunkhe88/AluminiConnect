import React from 'react';
import Footer from '../../components/layout/Footer';

export default function HelpCenter() {
  const faqs = [
    {
      q: "How do I register as an alumni?",
      a: "You cannot register directly as an alumni. Instead, sign up as a student, and the college administration will upgrade your account once they verify your PRN and graduation year against the master database."
    },
    {
      q: "How does the Student verification work?",
      a: "When you sign up, you provide your PRN. The system compares this against the official student records uploaded by the admin. If it matches, your account is automatically verified."
    },
    {
      q: "Can I connect with students or alumni outside my department?",
      a: "Yes! The Alumni Directory allows you to search and connect with members across all departments, batches, and professional industries."
    },
    {
      q: "Why am I not receiving email notifications?",
      a: "Please ensure your email address is correct in your Profile Settings. Additionally, check your spam/junk folder. Official college announcements will always appear in your Dashboard Notifications tab."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about AlumniConnect.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">Still have questions?</p>
          <a href="/contact" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Contact Support</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
