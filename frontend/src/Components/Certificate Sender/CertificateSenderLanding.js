import React from "react";
import { Link } from "react-router-dom";

const CertificateSenderLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-teal-500 mb-4">
          Send Personalized Certificates with Ease
        </h1>
        
        {/* Subheading */}
        <p className="text-gray-700 text-lg md:text-xl mb-6">
          Simplify your certificate sending process with CertiMail. Easily customize and deliver certificates right to recipients' inboxes.
        </p>
        
        {/* Call-to-action Button */}
        <Link to="/certificate-sender/start">
          <button className="bg-teal-400 text-black  font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-500 transition duration-200">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CertificateSenderLanding;
