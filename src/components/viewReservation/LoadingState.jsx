import React from 'react';

const LoadingState = () => {
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="text-center py-8">Loading reservation details...</div>
      </div>
    </div>
  );
};

export default LoadingState;
