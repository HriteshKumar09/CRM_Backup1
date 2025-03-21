import React, { useState, useEffect } from "react";
import Select from "react-select";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { LuCircleArrowRight } from "react-icons/lu";
import { CgArrowLeftO } from "react-icons/cg";
import axios from "axios";

const AddMember = ({ isOpen, onClose, refreshMembers }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    Address: "",
    phone: "",
    gender: "",
    jobTitle: "",
    salary: "",
    salaryTerm: "",
    dateOfHire: "",
    email: "",
    password: "",
    roleId: "",
    teamId: 1, // Assuming this is the default team ID
    language: "English",
  });

  const [isSuccess, setIsSuccess] = useState(false); // State to handle success message

  // Role options fetched from the backend
  const [roleOptions, setRoleOptions] = useState([]);

  // Fetch roles from the API when the component mounts
  useEffect(() => {
    fetch("http://localhost:4008/api/team-members/roles")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((role) => ({
          value: role["Role ID"], // Use Role ID as value
          label: role["Role Title"], // Use Role Title as label
        }));
        setRoleOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // Handle Role Change
  const handleRoleChange = (selectedOption) => {
    setFormData({ ...formData, roleId: selectedOption.value });
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Toggle Password Visibility
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    console.log(formData); // Check if formData is being updated correctly
  };

  // Email Validation Function
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Validate Current Step
  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.Address.trim()) newErrors.Address = "Mailing address is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    } else if (step === 2) {
      if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
      if (!formData.salary.trim()) newErrors.salary = "Salary is required";
      if (!formData.salaryTerm.trim()) newErrors.salaryTerm = "Salary Term is required";
      if (!formData.dateOfHire.trim()) newErrors.dateOfHire = "Date of hire is required";
    } else if (step === 3) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!isValidEmail(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.password.trim()) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation Handlers
  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Submit Form (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Submission:", formData); // Check if formData is available

    if (validateStep()) {
      try {
        const response = await axios.post("http://localhost:4008/api/team-members/add-members", formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Now sending for post", response.data); // Debugging response

        // Assuming the response status code is 200 for a successful request
        if (response.data.success || response.status === 201) {
          console.log("COngp", response.data); // Debugging response
          setIsSuccess(true); // Show success message
          refreshMembers();  // Refresh members list in parent component
          setTimeout(() => {
            setIsSuccess(false); // Hide success message after 3 seconds
            onClose();  // Close the modal
          }, 2000);
        } else {
          alert("Failed to add member.");
        }
      }catch (error) {
        console.error("Error adding member:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  // If modal is closed, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-[700px] relative overflow-auto dark:bg-gray-700 dark:text-white">
        <div className="flex items-center justify-between p-4 border-b">
          {/* Title */}
          <h2 className="text-2xl">Add Member</h2>

          {/* Close Button */}
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition">
            <IoClose size={28} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6 relative border-t">
          {["General Info", "Job Info", "Account Settings"].map((label, index) => (
            <div key={index} className="flex flex-col items-center w-full relative  mt-3">
              {/* Connecting Line */}
              {index !== 0 && (
                <div className={`absolute top-12 left-2 rounded-md right-2 h-1 transition-all duration-300 ${step > index + 1 ? "bg-green-500" : step === index + 1 ? "bg-blue-500" : "bg-gray-300"
                  }`}></div>
              )}

              {/* Step Circle */}
              <div className={`relative w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300 text-white border-2 ${step > index + 1
                ? "bg-green-500 border-green-500"
                : step === index + 1
                  ? "bg-blue-500 border-blue-500"
                  : "bg-gray-300 border-gray-300"
                }`}>
                {step > index + 1 ? "✔" : index + 1}
              </div>

              {/* Step Title */}
              <span className={`mt-5 text-sm font-semibold ${step >= index + 1 ? "text-blue-500" : "text-gray-400"
                }`}>{label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className=" p-4">
          {/* Step 1: General Info */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* Mailing Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Mailing Address</label>
                  <textarea
                    name="Address"
                    placeholder="Enter address"
                    value={formData.Address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  {errors.Address && <p className="text-red-500 text-sm mt-1">{errors.Address}</p>}
                </div>
                {/* Gender - Checkboxes */}
                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Gender</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} className="mr-2" />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} className="mr-2" />
                      Other
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                {/* Phone - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 2: Job Info */}
          {step === 2 && (
            <div>
              <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Enter Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">Salary</label>
                <input
                  type="text"
                  name="salary"
                  placeholder="Enter Salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">Salary Term</label>
                <input
                  type="text"
                  name="salaryTerm"
                  placeholder="Enter Salary Term"
                  value={formData.salaryTerm}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.salaryTerm && <p className="text-red-500 text-sm mt-1">{errors.salaryTerm}</p>}
              </div>

              {/* Date of Hire */}
              <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">Date of Hire</label>
                <input
                  type="date"
                  name="dateOfHire"
                  value={formData.dateOfHire}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.dateOfHire && <p className="text-red-500 text-sm mt-1">{errors.dateOfHire}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Account Settings */}
          {step === 3 && (
            <div>
              {/* Email Field */}
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="relative mt-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center border rounded-md">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none border-none"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="px-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Role Selection Dropdown */}
              <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="role">
                  Role
                </label>
                <Select
                  id="role"
                  name="role"
                  options={roleOptions}
                  value={roleOptions.find(option => option.value === formData.roleId) || null}
                  onChange={handleRoleChange}
                  className="w-full"
                  placeholder="Select a role..."
                  isSearchable
                />
              </div>
            
              {/* Email Login Checkbox */}
              <div className="flex items-center mt-4">
                <input type="checkbox" id="sendEmail" className="mr-2" />
                <label htmlFor="sendEmail" className="text-gray-600">
                  Email login details to this user
                </label>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-6 border-t p-5">
          <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded flex gap-1" onClick={onClose}> <IoClose size={18} className="mt-1" />Close</button>
          {step > 1 && <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded flex gap-1" onClick={prevStep}><CgArrowLeftO size={18} className="mt-1"/>Previous</button>}
          {step < 3 ? (
            <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded flex gap-1" onClick={nextStep}> <LuCircleArrowRight size={18} className="mt-1"/>Next</button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded flex gap-1">
            <FiCheckCircle size={18} className=" mt-1" />
            Save
            </button>
          )}
        </div>
        </form>
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Success</h3>
              <p>Member added successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;