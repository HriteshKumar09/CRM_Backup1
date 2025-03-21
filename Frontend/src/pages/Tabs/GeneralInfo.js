import React, { useEffect, useState } from "react";
import api from "../../Services/api";  // Importing central API instance
import { toast, ToastContainer } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

const GeneralInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");  // Get token from localStorage
      console.log("Token from Local Storage:", token);  // Log token for debugging

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Attach token to the request
        });
        console.log("API Response:", response.data); // Log the full response to check structure

        if (response.data.success) {
          setUserData(response.data.data); // Set the authenticated user's profile data
          setFormData(response.data.data); // Initialize form data
        } else {
          setError("Failed to fetch user data.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err.response ? err.response.data : err.message);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures it runs only once after the component mounts

  // Handle input change while editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle save of the edited user profile
  const handleSave = async () => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    console.log("Saving data:", formData); // Debugging

    // Format the date of birth (dob) to YYYY-MM-DD
    const formattedData = {
      ...formData,
      dob: formData.dob ? new Date(formData.dob).toISOString().split("T")[0] : null,
    };

    try {
      const response = await api.put(`/auth/${userData.id}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the request header
        },
      });

      console.log("API Response:", response.data); // Debugging

      if (response.data.success) {
        setUserData(formattedData); // Save updated data in userData state
        setIsEditing(false);
        toast.success("Profile updated successfully!"); // Show success toast
      } else {
        toast.error("Failed to update profile."); // Show error toast
      }
    } catch (err) {
      console.error("Error saving data:", err.response ? err.response.data : err.message);
      toast.error("Failed to save user data."); // Show error toast
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    console.log("Edit mode toggled:", !isEditing); // Debugging
    setIsEditing(!isEditing);
  };

  // Loading and error display
  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Fields to display in the general info table
  const fields = [
    { label: "First name", key: "first_name" },
    { label: "Last name", key: "last_name" },
    { label: "Mailing address", key: "address" },
    { label: "Alternative address", key: "alternative_address" },
    { label: "Phone", key: "phone" },
    { label: "Alternative phone", key: "alternative_phone" },
    { label: "Skype", key: "skype" },
    { label: "Date of birth", key: "dob" },
    { label: "SSN", key: "ssn" },
    { label: "Gender", key: "gender" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">General Info</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-6 py-3 font-semibold text-gray-800">Field</th>
              <th className="px-6 py-3 font-semibold text-gray-800">Value</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr className="border-t" key={field.key}>
                <td className="px-6 py-4 font-medium text-gray-700">{field.label}</td>
                <td className="px-6 py-4 text-gray-600">
                  {isEditing ? (
                    field.key === "gender" ? (
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Female
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Other"
                            checked={formData.gender === "Other"}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Other
                        </label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        name={field.key}
                        value={formData[field.key] || ""}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    )
                  ) : (
                    userData && userData[field.key] ? userData[field.key] : "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-4"
            >
              Save
            </button>
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Edit
          </button>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default GeneralInfo;