import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600">
                We collect information that you provide directly to us, including your name, email address, and financial data you choose to input into the application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the information we collect to provide and improve the Pocket Wise Finance Tracker service, to communicate with you, and to ensure the security of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal information for as long as your account is active or as needed to provide you services. We will delete your information upon your request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to access, correct, or delete your personal information. You can also opt-out of certain communications and data processing activities.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 