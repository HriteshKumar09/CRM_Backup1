import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import Select from "react-select";
import axios from 'axios';

const BASE_URL = "http://localhost:4008/api"; // ✅ Define API Base URL

const ComposeMessageModal = ({ isOpen, onClose, onSend }) => {
  const [recipient, setRecipient] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); // ✅ Store logged-in user info

  useEffect(() => {
    const fetchUserAndRecipients = async () => {
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          console.error("❌ No token found. User not authenticated.");
          return;
        }
    
        // ✅ Fetch logged-in user details
        const userResponse = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (!userResponse.data.success || !userResponse.data.data) {
          console.error("❌ Error fetching logged-in user.");
          return;
        }
    
        const loggedInUser = userResponse.data.data;
        setLoggedInUser({
          id: loggedInUser.id,
          name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
        });
    
        // ✅ Fetch all users
        const usersResponse = await axios.get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("🔹 API Response:", usersResponse.data); // ✅ Debugging log
    
        if (!usersResponse.data || !usersResponse.data.users) {
          console.error("❌ No users found in API response.");
          return;
        }
    
        const usersList = usersResponse.data.users;
        console.log("🔹 Users List:", usersList); // ✅ Debugging log
    
        if (!Array.isArray(usersList)) {
          console.error("❌ Users data is not an array:", usersList);
          return;
        }
    
        // ✅ Exclude logged-in user from recipient list
        const recipients = usersList
          .filter(user => user.id !== loggedInUser.id)
          .map(user => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
          }));
    
        setRecipientOptions(recipients);
    
      } catch (error) {
        console.error("❌ Error fetching user list:", error.response?.data || error);
      }
    };
    
    

    fetchUserAndRecipients();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg dark:bg-gray-700 dark:text-white">
        {/* 🔹 Modal Header */}
        <div className="flex justify-between">
          <h2 className="text-2xl ">Send Message</h2>
          <button onClick={onClose} className="">
            <IoClose size={24} />
          </button>
        </div>

        {/* 🔹 Form Fields */}
        <div className="space-y-4 mt-4 dark:bg-gray-700 dark:text-white">
          <div>
            <label className="block text-sm font-semibold ">To</label>
            <Select
            options={recipientOptions} // ✅ Display user names
            value={recipient}
            onChange={setRecipient}
            placeholder="- Select Recipient -"
            isSearchable
            className="w-full dark:bg-gray-700 dark:text-white"
          />
          </div>
          <div>
            <label className="block text-sm font-semibold ">Subject</label>
            <input
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold ">Message</label>
            <textarea
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 ">
          <button className=" text-white px-4 py-2 rounded" onClick={onClose}>
            <IoClose size={18} className="mr-1 inline" /> Close
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center" 
            onClick={() => onSend({ 
              from_user_id: loggedInUser?.id, 
              to_user_id: recipient?.value, 
              subject, 
              message 
            })}
            disabled={!recipient} // ✅ Disable send button if no recipient selected
          >
            <IoMdSend size={18} className="mr-1" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal;
