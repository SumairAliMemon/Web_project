import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
