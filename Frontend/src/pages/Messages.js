import React, { useState, useEffect } from "react";
import { FiInbox, FiSend, FiMail } from "react-icons/fi";
import ComposeMessageModal from "../extra/ComposeMessageModal.js";
import axios from "axios";

// ✅ Define Base API URL
const BASE_URL = "http://localhost:4008/api";

const MessageModule = () => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]); // ✅ Stores chat history
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox"); // ✅ Default to Inbox
  const [loggedInUserId, setLoggedInUserId] = useState(null); // ✅ Dynamic User ID
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchLoggedInUser(); // ✅ Fetch Logged-in User ID
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      fetchMessages(); // ✅ Fetch messages after user ID is available
    }
  }, [activeTab, loggedInUserId]); // Added fetchMessages as a dependency

  // ✅ Fetch the Logged-in User
  const fetchLoggedInUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setLoggedInUserId(response.data.data.id);
      } else {
        console.error("❌ Failed to fetch user details");
      }
    } catch (error) {
      console.error("❌ Error fetching logged-in user:", error);
    }
  };

  // ✅ Fetch Messages for Inbox/Sent
  const fetchMessages = async () => {
    if (!loggedInUserId) return;

    try {
      const response = await axios.get(`${BASE_URL}/messages/user/${loggedInUserId}`);
      let fetchedMessages = response.data.data || [];

      if (activeTab === "inbox") {
        fetchedMessages = fetchedMessages.filter((msg) => msg.to_user_id === loggedInUserId);
      } else {
        fetchedMessages = fetchedMessages.filter((msg) => msg.from_user_id === loggedInUserId);
      }

      setMessages(fetchedMessages);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  // ✅ Fetch Full Conversation
  const fetchConversation = async (otherUserId) => {
    if (!loggedInUserId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/messages/conversation?user1=${loggedInUserId}&user2=${otherUserId}`
      );

      setConversation(response.data.messages || []);
      setSelectedUser(otherUserId);
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
    }
  };

  // ✅ Handle Sending a New Message
  const handleSendMessage = async (messageData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/messages/send`, messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        fetchMessages(); // ✅ Refresh message list
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
    setIsComposeOpen(false);
  };

  // ✅ Send Reply
  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/messages/send`,
        {
          subject: `Re: ${conversation.length ? conversation[0].subject : "No Subject"}`,
          message: replyMessage,
          from_user_id: loggedInUserId,
          to_user_id: selectedUser,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyMessage("");
      fetchConversation(selectedUser);
    } catch (error) {
      console.error("❌ Error sending reply:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 dark:bg-gray-700 dark:text-white">
      {/* 🔹 Sidebar Navigation */}
      <div className="w-1/4 bg-white shadow-lg rounded-lg p-4 dark:bg-gray-700 dark:text-white">
        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center text-lg font-semibold mb-4"
        >
          <FiMail className="mr-2" /> Compose
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center text-lg font-semibold mb-4 ${
            activeTab === "inbox" ? "text-blue-600" : ""
          }`}
        >
          <FiInbox className="mr-2" /> Inbox
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex items-center text-lg font-semibold ${
            activeTab === "sent" ? "text-blue-600" : ""
          }`}
        >
          <FiSend className="mr-2" /> Sent Items
        </button>
      </div>

      {/* 🔹 Message Panel (Inbox / Sent Items) */}
      <div className="w-1/2 bg-white shadow-lg rounded-lg p-4 mx-4 dark:bg-gray-700 dark:text-white">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">{activeTab === "inbox" ? "Inbox" : "Sent Items"}</h2>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-48 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {messages.length > 0 ? (
          <ul className="border rounded-md">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="p-3 border-b cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
                onClick={() => fetchConversation(activeTab === "inbox" ? msg.from_user_id : msg.to_user_id)}
              >
                <strong>{activeTab === "inbox" ? msg.sender_name : msg.receiver_name}:</strong> {msg.subject}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8">No messages found.</p>
        )}
      </div>

      {/* 🔹 Conversation Panel */}
      <div className="w-1/3 bg-white shadow-lg rounded-lg p-4 dark:bg-gray-700 dark:text-white">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-semibold">Chat with {selectedUser}</h2>
            <div className="mt-4 border-t pt-3 h-60 overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`mb-2 p-2 rounded-lg ${msg.from_user_id === loggedInUserId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'}`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            <textarea
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white mt-3"
              rows="3"
              placeholder="Write a reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={handleReply}>
              Reply
            </button>
          </>
        ) : (
          <p className="text-center py-8">Select a conversation.</p>
        )}
      </div>

      <ComposeMessageModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} onSend={handleSendMessage} />
    </div>
  );
};

export default MessageModule;
