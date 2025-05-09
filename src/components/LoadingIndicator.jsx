import React, { useState, useEffect } from 'react';

const LoadingIndicator = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Simulate authentication
    const timer = setTimeout(() => {
      setIsAuth(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 transition-all duration-700">
      {!isAuth ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg animate-pulse">Authenticating...</p>
        </div>
      ) : (
        <div className="text-center animate-fade-in-up">
          <h1 className="text-green-600 text-2xl font-bold">
            Authenticated! <span role="img" aria-label="checkmark">✔️</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;
