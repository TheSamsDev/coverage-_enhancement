import React from 'react';

const Preloader = ({ progress, error }) => {
  return (
    <div className="preloader">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div>Loading store data... {progress}%</div>
        </>
      )}
    </div>
  );
};

export default Preloader;