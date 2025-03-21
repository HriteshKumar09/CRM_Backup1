import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { FaCamera, FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Addannouncement = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [allClientsChecked, setAllClientsChecked] = useState(false);
  const [specificGroupChecked, setSpecificGroupChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle "All Clients" selection
  const handleAllClientsChange = (e) => {
    setAllClientsChecked(e.target.checked);
    if (e.target.checked) {
      setSpecificGroupChecked(false); // Hide "Specific Client Groups"
    }
  };

  // Handle "Specific Client Groups" selection
  const handleSpecificGroupChange = (e) => {
    setSpecificGroupChecked(e.target.checked);
    if (e.target.checked) {
      setAllClientsChecked(false); // Hide "All Clients"
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("allClients", allClientsChecked);
    formData.append("specificGroup", specificGroupChecked);
    formData.append("searchQuery", searchQuery);
    if (file) {
      formData.append("file", file);
    }

    // Send the data to your backend
    try {
      const response = await fetch("YOUR_BACKEND_API_URL", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Announcement created successfully!");
      } else {
        alert("Error creating announcement.");
      }
    } catch (error) {
      alert("Error submitting form: " + error.message);
    }
  };
  // Remove uploaded file
  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center dark:bg-gray-700 dark:text-white">
      <div className="bg-slate-200 shadow-lg rounded-lg p-4 w-full dark:bg-gray-700 dark:text-white">
        <label className="font-medium text-2xl">Add Announcement</label>
        <label className="block font-semibold border-t border-black mt-2">Title</label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Jodit Editor for Rich Text Editing */}
        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => setContent(newContent)}
          className="border p-4 min-h-[200px] rounded-md mb-4 dark:bg-gray-700 dark:text-white"
        />

        <div className="flex justify-around">
          <div className="flex gap-8">
            <label className="font-semibold">Start Date</label>
            <input type="date" className="border rounded dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex gap-8">
            <label className="font-semibold">End Date</label>
            <input type="date" className="border p-1 rounded dark:bg-gray-700 dark:text-white" />
          </div>
        </div>

        <div className="mt-4 mb-6">
          <label className="font-semibold">Share with</label>
          <div className="flex flex-col gap-2">
            <label>
              <input type="checkbox" className="mr-2" /> All team members
            </label>

            {/* Hide "Specific Client Groups" when "All Clients" is checked */}
            {!specificGroupChecked && (
              <label>
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allClientsChecked}
                  onChange={handleAllClientsChange}
                />
                All Clients
              </label>
            )}

            {/* Hide "All Clients" when "Specific Client Groups" is checked */}
            {!allClientsChecked && (
              <label>
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={specificGroupChecked}
                  onChange={handleSpecificGroupChange}
                />
                Specific Client Groups
              </label>
            )}

            {/* Show Search Input when Specific Client Groups is checked */}
            {specificGroupChecked && (
              <input
                type="text"
                className="border p-2 rounded mt-2 dark:bg-gray-700 dark:text-white"
                placeholder="Search for client groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Footer Section with Upload & Save Button */}
        <div className="bg-slate-100 border-t border-black p-3 flex justify-between rounded-b-md items-center dark:bg-gray-700 dark:text-white">
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer bg-gray-200 px-4 py-2 gap-1 rounded-md shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white flex">
              <FaCamera className="mt-1" /> Upload File
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            {file && (
              <div className="relative">
                <img src={URL.createObjectURL(file)} alt="Uploaded" className="h-12 w-12 rounded-md shadow-md" />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs dark:bg-gray-700 dark:text-white"
                >
                  <IoMdClose />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 dark:bg-gray-700 dark:text-white flex gap-1"
          >
            <FaCheck className="mt-1" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addannouncement;