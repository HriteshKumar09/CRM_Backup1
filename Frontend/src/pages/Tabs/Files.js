import React from "react";

const Files = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800">Files</h2>
          <p className="text-gray-600 mt-2">Manage and upload your files here.</p>
        </div>

        <div className="px-6 py-6">
          {/* File upload section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700">Upload Files</h3>
            <div className="mt-4">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-gray-50 file:rounded-md file:text-gray-700 file:focus:ring-2 file:focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">Choose a file to upload.</p>
            </div>
          </div>

          {/* Files Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Date Uploaded</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example file list (dynamic content will go here) */}
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-600">Document 1.pdf</td>
                  <td className="px-6 py-4 text-sm text-gray-600">2025-01-31</td>
                  <td className="px-6 py-4 text-sm text-gray-600">1.2 MB</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-500 hover:text-blue-700">
                      View
                    </button>
                    <span className="mx-2">|</span>
                    <button className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-600">Image 2.jpg</td>
                  <td className="px-6 py-4 text-sm text-gray-600">2025-01-25</td>
                  <td className="px-6 py-4 text-sm text-gray-600">500 KB</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-500 hover:text-blue-700">
                      View
                    </button>
                    <span className="mx-2">|</span>
                    <button className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
