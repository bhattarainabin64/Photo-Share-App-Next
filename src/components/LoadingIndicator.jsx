import React, { useState, useEffect } from 'react';

const LoadingIndicator = () => {
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    // Simulate an authentication process
    setTimeout(() => {
      setIsAuth(true); // Set to true after 3 seconds to simulate authentication success
    }, 3000);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {!isAuth ? (
        <div className="w-16 h-16 border-4 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
      ) : (
        <div className="text-xl font-semibold text-green-500">
          Authenticated! <span role="img" aria-label="checkmark">✔️</span>
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;
