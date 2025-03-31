import React, { useState, useEffect } from "react";
import api from "../Services/api";
import { IoMdClose } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import { SlClose } from "react-icons/sl";
import { CiHeart } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PollDetail = ({ pollId, closeModal, handleDeleteClick, handleOpenDialog }) => {
  const [poll, setPoll] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPollData = async () => {
      setIsLoading(true);
      try {
        // Fetch poll details
        const pollResponse = await api.get(`/team-members/polls/${pollId}`);
        setPoll(pollResponse.data);

        // Fetch poll answers
        const answersResponse = await api.get(`/team-members/polls/${pollId}/answers`);
        if (answersResponse.data && answersResponse.data.answers) {
          setAnswers(answersResponse.data.answers);
        } else {
          setAnswers([]);
          console.warn("No answers data structure found in response");
        }

        // Fetch poll votes
        const votesResponse = await api.get(`/team-members/polls/${pollId}/votes`);
        setVotes(Array.isArray(votesResponse.data) ? votesResponse.data : []);
      } catch (error) {
        console.error("Error fetching poll data:", error);
        toast.error(error.response?.data?.error || "Failed to load poll details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      fetchPollData();
    }
  }, [pollId]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.sub || payload.userId;
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  const handleVote = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("You must be logged in to vote.");
      return;
    }

    if (!selectedAnswerId) {
      toast.error("Please select an option to vote.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/team-members/polls/${pollId}/votes`, {
        poll_id: pollId,
        poll_answer_id: selectedAnswerId,
        created_by: userId,
      });

      // Refresh votes after successful submission
      const votesResponse = await api.get(`/team-members/polls/${pollId}/votes`);
      setVotes(Array.isArray(votesResponse.data) ? votesResponse.data : []);
      toast.success("Your vote has been recorded successfully.");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error(error.response?.data?.error || "Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) {
      toast.error("Please enter a valid answer.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/team-members/polls/${pollId}/answers`, {
        title: newAnswer.trim(),
      });

      // Refresh answers after successful addition
      const answersResponse = await api.get(`/team-members/polls/${pollId}/answers`);
      if (answersResponse.data && answersResponse.data.answers) {
        setAnswers(answersResponse.data.answers);
        setNewAnswer("");
        toast.success("Answer added successfully.");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
      toast.error(error.response?.data?.error || "Failed to add answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!answerId) {
      toast.error("Invalid answer.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.delete(`/team-members/polls/${pollId}/answers/${answerId}`);
      
      // Refresh answers after successful deletion
      const answersResponse = await api.get(`/team-members/polls/${pollId}/answers`);
      if (answersResponse.data && answersResponse.data.answers) {
        setAnswers(answersResponse.data.answers);
        toast.success("Answer deleted successfully.");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      toast.error(error.response?.data?.error || "Failed to delete answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate vote counts for each answer
  const getVoteCount = (answerId) => {
    return votes.filter(vote => vote.poll_answer_id === answerId).length;
  };

  const chartData = {
    labels: answers.map((answer) => answer.title),
    datasets: [
      {
        label: 'Votes',
        data: answers.map((answer) => getVoteCount(answer.id)),
        backgroundColor: answers.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`),
        borderColor: answers.map(() => 'rgba(255, 255, 255, 0.6)'),
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!poll) {
    return <div className="text-red-500">Poll not found</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[9999]">
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
        theme="light"
        style={{ zIndex: 99999 }}
      />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl relative z-[9999] overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b sticky top-0 bg-white z-[10000] py-2">
          <h2 className="text-2xl">Poll #{poll.id}</h2>
          <div onClick={closeModal} className="text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
            <IoMdClose size={18} />
          </div>
        </div>
        <div className="flex justify-between p-4">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{poll.title}</h2>
              <p className="text-sm text-gray-600">{poll.description}</p>
              <p className="text-sm text-gray-600">Poll created by {poll.created_by}</p>
              <p className="text-sm text-gray-600">Poll will expire at {new Date(poll.expire_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Add new answer"
                  style={{ marginRight: "10px" }}
                  disabled={isSubmitting}
                />
                <button
                  className="border bg-blue-500 text-white hover:bg-blue-300 rounded-md px-4 py-2"
                  onClick={handleAddAnswer}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              {answers.map((answer) => (
                <div key={answer.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    id={`answer-${answer.id}`}
                    name="poll-answer"
                    value={answer.id}
                    checked={selectedAnswerId === answer.id}
                    onChange={() => setSelectedAnswerId(answer.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`answer-${answer.id}`} className="flex-grow">
                    {answer.title}
                  </label>
                  <span className="text-sm text-gray-600">{getVoteCount(answer.id)} votes</span>
                  <button
                    onClick={() => handleDeleteAnswer(answer.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <SlClose size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="border bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                onClick={handleVote}
                disabled={isSubmitting || !selectedAnswerId}
              >
                {isSubmitting ? "Voting..." : "Vote"}
              </button>
            </div>
          </div>
          <div>
            <div className="bg-white p-6 rounded-lg dark:bg-gray-900 dark:text-white w-64">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{votes.length}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1">
                    <FaRegEye className="mt-1" /> Total Votes
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{answers.length}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex">
                    <CiHeart className="mt-1" /> Total Options
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center mb-4">
                <div style={{ marginTop: "30px" }}>
                  <Pie data={chartData} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t p-2 sticky bottom-0 bg-white z-[10000]">
          <button
            onClick={closeModal}
            className="border text-red-500 py-2 px-4 rounded-lg hover:text-red-200"
          >
            Close
          </button>
          <button
            className="text-green-500 border py-2 px-4 rounded-lg hover:text-green-200"
            onClick={() => handleOpenDialog(poll)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 border text-white py-2 px-4 rounded-lg hover:bg-red-200 flex"
            onClick={() => handleDeleteClick(poll.id)}
          >
            <SlClose size={16} className="mt-1" />
            Mark as Inactive
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;