import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import Select from "react-select";
import api from "../Services/api";
import { toast } from "react-toastify";

const ComposeMessageModal = ({ isOpen, onClose, onSend }) => {
  const [recipient, setRecipient] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndRecipients = async () => {
      try {
        // Fetch logged-in user details
        const userResponse = await api.get("/auth/profile");
        if (userResponse.data.success) {
          const loggedInUser = userResponse.data.data;
          setLoggedInUser({
            id: loggedInUser.id,
            name: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
          });

          // Fetch team members
          const teamResponse = await api.get("/auth/team-members");
          if (teamResponse.data.success) {
            const teamMembers = teamResponse.data.users;
            const recipients = teamMembers
              .filter(user => user.id !== loggedInUser.id)
              .map(user => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name} (${user.job_title || 'Team Member'})`,
              }));

            setRecipientOptions(recipients);
          }
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
        toast.error("Failed to fetch user list");
      }
    };

    if (isOpen) {
      fetchUserAndRecipients();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!recipient || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await onSend({
        from_user_id: loggedInUser?.id,
        to_user_id: recipient.value,
        subject,
        message
      });
      setRecipient(null);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg dark:bg-gray-700">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Send Message</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              To <span className="text-red-500">*</span>
            </label>
            <Select
              options={recipientOptions}
              value={recipient}
              onChange={setRecipient}
              placeholder="Select Recipient"
              isSearchable
              className="w-full dark:text-gray-900"
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  '&:hover': {
                    borderColor: '#9ca3af'
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#3b82f6' : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#2563eb' : '#f3f4f6'
                  }
                })
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border p-2 rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
              rows="4"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <IoMdSend className="mr-2" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal; 