import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";
import { SlClose } from "react-icons/sl";

const Comments = () => {
  const [postText, setPostText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadProgress(100); // Simulate full upload
    }
  };

  // Remove Uploaded File
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="flex gap-4 p-4">
      {/* Profile Avatar */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full"></div>

      {/* Post Input Container */}
      <div className="flex-1 bg-white rounded-lg p-4 border border-gray-300">
        {/* Text Input */}
        <textarea
          placeholder="Share an idea or documents..."
          rows="2"
          className="w-full p-2 mb-3 border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        {/* File Preview (Only Show if File is Uploaded) */}
        {uploadedFile && (
          <div className="relative flex items-center p-2 mb-3 border border-gray-300 rounded-md bg-gray-100">
            <img
              src={uploadedFile.type.startsWith("image/") ? URL.createObjectURL(uploadedFile) : "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"}
              alt="Uploaded File"
              className="w-16 h-16 rounded-md object-cover border mr-2"
            />
            {/* Upload Progress Bar */}
            <div className="w-full ml-2 bg-gray-200 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>

            {/* Remove File Button */}
            <button
              className="absolute top-0 right-0 bg-white p-1 rounded-full hover:bg-gray-200"
              onClick={handleRemoveFile}
            >
              <SlClose />
            </button>
          </div>
        )}

        {/* Bottom Section (File Upload & Post Button) */}
        <div className="flex justify-between items-center">
          {/* Upload Button */}
          <label className="flex items-center text-blue-500 cursor-pointer">
            <CiCamera className="mr-2" />
            <span className="text-sm">Upload File</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Post Button */}
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 ${
              !postText && !uploadedFile ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!postText && !uploadedFile}
          >
            <IoSend />
            <span>Post Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
