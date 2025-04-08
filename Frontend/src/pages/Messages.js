import React, { useState, useEffect } from "react";
import { FiInbox, FiSend, FiMail } from "react-icons/fi";
import ComposeMessageModal from "../extra/ComposeMessageModal.js";
import api from "../Services/api"; // Use the central API service
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setLoggedInUserId(response.data.data.id);
      } else {
        console.error("❌ Failed to fetch user details");
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("❌ Error fetching logged-in user:", error);
      toast.error("Failed to fetch user details");
    }
  };

  // ✅ Fetch Messages for Inbox/Sent
  const fetchMessages = async () => {
    if (!loggedInUserId) return;
    setLoading(true);
    try {
      const response = await api.get(`/messages/user/${loggedInUserId}`);
      if (response.data.success) {
        let fetchedMessages = response.data.data || [];
        
        // Filter messages based on active tab
        if (activeTab === "inbox") {
          fetchedMessages = fetchedMessages.filter(msg => msg.to_user_id === loggedInUserId);
        } else {
          fetchedMessages = fetchedMessages.filter(msg => msg.from_user_id === loggedInUserId);
        }
        
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Full Conversation
  const fetchConversation = async (otherUserId) => {
    if (!loggedInUserId) return;
    setLoading(true);
    try {
      const response = await api.get(`/messages/conversation?user1=${loggedInUserId}&user2=${otherUserId}`);
      if (response.data.success) {
        setConversation(response.data.messages || []);
        setSelectedUser(otherUserId);
      }
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
      toast.error("Failed to fetch conversation");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Sending a New Message
  const handleSendMessage = async (messageData) => {
    try {
      const response = await api.post("/messages/send", messageData);
      if (response.data.success) {
        toast.success("Message sent successfully");
        fetchMessages(); // ✅ Refresh message list
        if (selectedUser) {
          fetchConversation(selectedUser);
        }
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error("Failed to send message");
    }
    setIsComposeOpen(false);
  };

  // ✅ Send Reply
  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedUser) return;
    try {
      const response = await api.post("/messages/send", {
        from_user_id: loggedInUserId,
        to_user_id: selectedUser,
        subject: `Re: ${selectedMessage?.subject || "No Subject"}`,
        message: replyMessage
      });
      
      if (response.data.success) {
        setReplyMessage("");
        fetchConversation(selectedUser);
        toast.success("Reply sent successfully");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    const otherUserId = activeTab === "inbox" ? message.from_user_id : message.to_user_id;
    fetchConversation(otherUserId);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 dark:bg-gray-800">
      {/* 🔹 Sidebar Navigation */}
      <div className="w-1/4 bg-white rounded-lg shadow p-4 dark:bg-gray-700">
        <button
          onClick={() => setIsComposeOpen(true)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <FiMail className="inline mr-2" /> Compose
        </button>
        
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`w-full text-left py-2 px-4 rounded-lg ${
              activeTab === "inbox"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <FiInbox className="inline mr-2" /> Inbox
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`w-full text-left py-2 px-4 rounded-lg ${
              activeTab === "sent"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <FiSend className="inline mr-2" /> Sent
          </button>
        </div>
      </div>

      {/* 🔹 Message Panel (Inbox / Sent Items) */}
      <div className="w-1/3 bg-white rounded-lg shadow mx-4 p-4 dark:bg-gray-700">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedMessage?.id === message.id
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <div className="font-semibold dark:text-white">
                  {activeTab === "inbox" ? message.sender_name : message.receiver_name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{message.subject}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No messages found
          </div>
        )}
      </div>

      {/* 🔹 Conversation Panel */}
      <div className="w-1/3 bg-white rounded-lg shadow p-4 dark:bg-gray-700">
        {selectedUser ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Conversation with {activeTab === "inbox" ? selectedMessage?.sender_name : selectedMessage?.receiver_name}
              </h3>
            </div>

            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.from_user_id === loggedInUserId
                      ? "bg-blue-100 ml-auto dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-600"
                  }`}
                >
                  <div className="text-sm dark:text-white">{msg.message}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-2 border rounded-lg mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                rows="3"
              />
              <button
                onClick={handleReply}
                disabled={!replyMessage.trim()}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Select a message to view conversation
          </div>
        )}
      </div>

      <ComposeMessageModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} onSend={handleSendMessage} />
    </div>
  );
};

export default MessageModule;
