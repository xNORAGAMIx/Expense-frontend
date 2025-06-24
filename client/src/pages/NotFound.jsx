import React from 'react';
import { Link } from 'react-router-dom';
import { FaReceipt, FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-32 h-32 mb-8 rounded-full bg-gradient-to-r from-[#7F56D9] to-[#9333EA] flex items-center justify-center shadow-xl">
        <FaReceipt className="text-white text-5xl" />
      </div>
      
      <h1 className="text-6xl font-bold text-[#111827] mb-4 font-[Poppins]">404</h1>
      <h2 className="text-3xl font-semibold text-[#111827] mb-6 font-[Poppins]">Page Not Found</h2>
      
      <p className="text-lg text-gray-600 max-w-md mb-8 font-[DM Sans]">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <FaHome className="mr-2" />
          Return Home
        </Link>
        
        <Link
          to="/search"
          className="px-6 py-3 bg-white text-[#7F56D9] border border-[#7F56D9] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <FaSearch className="mr-2" />
          Search
        </Link>
      </div>
      
      <div className="mt-12 text-sm text-gray-500 font-[DM Sans]">
        <p>Need help? <Link to="/contact" className="text-[#7F56D9] hover:underline">Contact support</Link></p>
      </div>
    </div>
  );
};

export default NotFound;