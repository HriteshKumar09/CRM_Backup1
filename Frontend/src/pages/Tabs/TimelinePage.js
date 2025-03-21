import React from "react";

const TimelinePage = () => {
  return (
    <div className="space-y-10 p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Timeline</h2>
      
      <p className="text-gray-700 text-lg leading-relaxed">
        Welcome to the Timeline page! Here you can track the key milestones and activities over time. Whether it's project updates, team achievements, or personal progress, the timeline provides a chronological view of important events.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activities</h3>
        <ul className="space-y-6">
          <li className="flex items-start space-x-5">
            <span className="h-3 w-3 bg-blue-500 rounded-full mt-1.5"></span>
            <div>
              <p className="text-gray-900 font-medium">
                <strong>Project Kickoff</strong> - The new project "BlueSky Initiative" was started. Team members were briefed on the goals and milestones.
              </p>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </li>
          <li className="flex items-start space-x-5">
            <span className="h-3 w-3 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <p className="text-gray-900 font-medium">
                <strong>Feature Release</strong> - The v1.5 update for the platform went live, introducing new features and bug fixes.
              </p>
              <span className="text-sm text-gray-500">1 week ago</span>
            </div>
          </li>
          <li className="flex items-start space-x-5">
            <span className="h-3 w-3 bg-yellow-500 rounded-full mt-1.5"></span>
            <div>
              <p className="text-gray-900 font-medium">
                <strong>Annual Team Meeting</strong> - The team discussed upcoming projects and celebrated achievements from the past year.
              </p>
              <span className="text-sm text-gray-500">2 weeks ago</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white border-l-4 border-blue-600 shadow-sm p-8 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use This Timeline</h3>
        <p className="text-gray-700 leading-relaxed">
          Use the timeline to review key milestones and ensure you stay updated on the progress of ongoing activities. Click on individual events to view detailed reports or add comments.
        </p>
      </div>
    </div>
  );
};

export default TimelinePage;
