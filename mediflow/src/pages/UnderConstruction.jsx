import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1); // Navigate back to the previous page
    };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">🚧 Under Construction 🚧</h1>
        <p className="text-lg text-gray-600 mb-6">We are working hard to bring this page to life. Please check back later.</p>
        <div className="flex justify-center items-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/001/218/694/original/under-construction-warning-sign-vector.jpg"
            alt="Under Construction"
            className="w-40 h-40 object-contain mb-4"
          />
        </div>
        <p className="text-sm text-gray-500">Thank you for your patience!</p>
        <button
          onClick={goBack}
          className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
        >Go Back</button>
      </div>
    </div>
  );
};

export default UnderConstruction;
