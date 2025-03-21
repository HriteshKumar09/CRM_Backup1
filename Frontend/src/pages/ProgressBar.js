import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="relative w-full bg-gray-200 rounded group">
            {/* Progress Bar */}
            <div
                className="bg-blue-500 h-1.5 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                style={{ width: `${progress}%` }}
            ></div>

            {/* Hidden Percentage (Shows on Hover) */}
            <span className="absolute left-1/2 top-full mt-1 transform -translate-x-1/2 text-gray-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {progress}%
            </span>
        </div>
    );
};

export default ProgressBar;