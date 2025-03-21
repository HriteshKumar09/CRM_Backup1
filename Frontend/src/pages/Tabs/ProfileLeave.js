import React from "react";

const ProfileLeave = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Leave Requests</h2>
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        >
          Apply for Leave
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          View Leave History
        </button>
      </div>

      {/* Leave Status Table */}
      <div className="overflow-x-auto bg-gray-50 shadow-sm rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Leave Type</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-3">Sick Leave</td>
              <td className="px-4 py-3">2025-05-01</td>
              <td className="px-4 py-3">2025-05-05</td>
              <td className="px-4 py-3 text-green-600">Approved</td>
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-3">Vacation</td>
              <td className="px-4 py-3">2025-06-15</td>
              <td className="px-4 py-3">2025-06-20</td>
              <td className="px-4 py-3 text-yellow-600">Pending</td>
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileLeave;
