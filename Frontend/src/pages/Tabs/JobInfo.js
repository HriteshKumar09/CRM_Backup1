import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../Services/api.js"; // Import the centralized API instance
import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const JobInfo = () => {
  const [jobInfo, setJobInfo] = useState({
    date_of_hire: "",
    salary: "",
    salary_term: "",
  }); // Store job info in state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if the user is editing
  const [hasData, setHasData] = useState(false); // Track if job info exists
  const [userId, setUserId] = useState(null); // Store userId from token

  useEffect(() => {
    const fetchJobInfo = async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }
  
      try {
        // Decode the token to get the userId
        const decoded = jwtDecode(token);
        const userId = decoded.userId; // Assuming the token contains the userId field
        setUserId(userId); // Set userId in state
        
  
        // Fetch the job information for the logged-in user using the centralized API
        const response = await api.get(`/team-members/jobinfo/${userId}`);
  
        if (response.data.success && response.data.data.length > 0) {
          // Set the job info from the response
          setJobInfo(response.data.data[0]);
          setHasData(true); // Job info exists
        } else {
          setError("No job information found.");
          setHasData(false); // Job info does not exist
  
          // Clear the error message after 3 seconds
          setTimeout(() => {
            setError("");
          }, 3000);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load job information.");
        setLoading(false);
  
        // Clear the error message after 3 seconds
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    };
  
    fetchJobInfo();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) {
      setError("Unauthorized: Please log in.");
      return;
    }
  
    try {
      // Format the date_of_hire to YYYY-MM-DD
      const formattedDateOfHire = jobInfo.date_of_hire
        ? new Date(jobInfo.date_of_hire).toISOString().split("T")[0]
        : null;
  
      let response;
      if (!hasData) {
        // If job info does not exist, create it using POST
        response = await api.post(`/team-members/jobinfo`, {
          userId,
          dateOfHire: formattedDateOfHire, // Use formatted date
          salary: jobInfo.salary,
          salaryTerm: jobInfo.salary_term,
        });
      } else {
        // If job info exists, update it using PUT
        response = await api.put(`/team-members/jobinfo/${userId}`, {
          dateOfHire: formattedDateOfHire, // Use formatted date
          salary: jobInfo.salary,
          salaryTerm: jobInfo.salary_term,
        });
      }
  
      if (response.data.success) {
        setIsEditing(false); // Exit editing mode
        setHasData(true); // Job info now exists
        toast.success("Job info saved successfully!"); // Show success toast
      } else {
        toast.error("Failed to save job information."); // Show error toast
      }
    } catch (err) {
      toast.error("Failed to save job information."); // Show error toast
      console.error("Error:", err); // Log the error for debugging
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Job Information</h2>

      <div className="space-y-6">
        {/* Date of Hire */}
        <div className="flex justify-between items-center py-3 border-b border-gray-300">
          <span className="text-lg font-medium text-gray-800">Date of Hire:</span>
          {isEditing ? (
            <input
              type="date"
              name="date_of_hire"
              value={jobInfo.date_of_hire || ""}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          ) : (
            <span className="text-gray-600">
              {jobInfo.date_of_hire ? new Date(jobInfo.date_of_hire).toLocaleDateString() : "No data available"}
            </span>
          )}
        </div>

        {/* Salary */}
        <div className="flex justify-between items-center py-3 border-b border-gray-300">
          <span className="text-lg font-medium text-gray-800">Salary:</span>
          {isEditing ? (
            <input
              type="number"
              name="salary"
              value={jobInfo.salary || ""}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          ) : (
            <span className="text-gray-600">
              {jobInfo.salary ? `$${jobInfo.salary.toLocaleString()}` : "No data available"}
            </span>
          )}
        </div>

        {/* Salary Term */}
        <div className="flex justify-between items-center py-3 border-b border-gray-300">
          <span className="text-lg font-medium text-gray-800">Salary Term:</span>
          {isEditing ? (
            <input
              type="text"
              name="salary_term"
              value={jobInfo.salary_term || ""}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          ) : (
            <span className="text-gray-600">{jobInfo.salary_term || "No data available"}</span>
          )}
        </div>
      </div>

      {/* Edit/Save Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {hasData ? "Update" : "Save"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default JobInfo;