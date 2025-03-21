import { useEffect, useState } from "react";

const Overview = () => {
  const [progress, setProgress] = useState(0);
  const progressValue = 0;

  useEffect(() => {
    // Simulate a loading effect by gradually increasing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= progressValue) {
          clearInterval(interval);
          return progressValue;
        }
        return prev + 1;
      });
    }, 20); // Speed of animation

    return () => clearInterval(interval);
  }, [progressValue]);

  return (
    <div className="grid grid-cols-12 gap-4 mt-6">
    {/* Progress & Details Section */}
    <div className="col-span-4 bg-white shadow-md rounded-lg  dark:bg-gray-700 dark:text-white">
    <div className="bg-blue-500 rounded-t-lg p-4 flex justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="white"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="yellow"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2" /* 2 * π * 40 */
            strokeDashoffset={`${251.2 - (progress / 100) * 251.2}`}
            strokeLinecap="round"
            className="transition-all duration-200 ease-in-out"
          />
        </svg>

        {/* Progress Text */}
        <span className="text-xl font-semibold text-white absolute">
          {progress}%
        </span>
      </div>
    </div>
      <div className='p-3'>
        <p className="text-gray-600 dark:text-gray-400">Start Date: <strong>2025-02-17</strong></p>
        <p className="text-gray-600 dark:text-gray-400 border-t">Deadline: <strong>2025-02-17</strong></p>
        <p className="text-gray-600 dark:text-gray-400 border-t">Client: <span className="text-blue-500 cursor-pointer">Drighna</span></p>
      </div>
    </div>
    <div className="col-span-4 bg-white shadow-md rounded-lg  dark:bg-gray-700 dark:text-white">
      
    </div>

    {/* Activity Section */}
    <div className="col-span-8 bg-white shadow-md rounded-lg p-6 dark:bg-gray-700 dark:text-white">
      <h3 className="text-lg font-semibold">Activity</h3>
      <div className="border-t mt-4 pt-4 text-gray-600 dark:text-gray-400">
        No recent activity.
      </div>
    </div>

    {/* Total Hours Worked */}
    <div className="col-span-12 bg-white shadow-md p-4 rounded-lg dark:bg-gray-700 dark:text-white text-center mt-4">
      <p className="text-xl font-bold">0.00</p>
      <p className="text-gray-600 dark:text-gray-400">Total Hours Worked</p>
    </div>
  </div>
  )
}

export default Overview