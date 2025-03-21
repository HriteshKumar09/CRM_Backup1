import { createPoll, getAllPolls, getPollById, updatePollById, deletePollById, getPollAnswersByPollId } from '../model/polls.model.js';
import { createPollAnswer, createPollVote, getPollVotes } from '../model/polls.model.js';

// Create a new poll
export const createPollController = async (req, res) => {
  const { title, description, created_by, created_at, expire_at, status } = req.body;
  try {
    const pollId = await createPoll({ title, description, created_by, created_at, expire_at, status });
    res.status(201).json({ message: "Poll created successfully", pollId });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
};

// Get all polls
export const getAllPollsController = async (req, res) => {
  try {
    const polls = await getAllPolls();
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};

// Get specific poll by id
export const getPollByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await getPollById(id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
};

// Update poll by id
export const updatePollByIdController = async (req, res) => {
  const { id } = req.params;
  const { title, description, expire_at, status } = req.body;
  try {
    const affectedRows = await updatePollById(id, { title, description, expire_at, status });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json({ message: "Poll updated successfully" });
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Failed to update poll" });
  }
};

// Delete poll by id (soft delete)
export const deletePollByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const affectedRows = await deletePollById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ error: "Failed to delete poll" });
  }
};

// Create a poll answer
// export const createPollAnswerController = async (req, res) => {
//   const { poll_id, title, deleted } = req.body;
//   try {
//     const answerId = await createPollAnswer({ poll_id, title, deleted });
//     res.status(201).json({ message: "Poll answer created successfully", answerId });
//   } catch (error) {
//     console.error("Error creating poll answer:", error);
//     res.status(500).json({ error: "Failed to create poll answer" });
//   }
// };

export const createPollAnswerController = async (req, res) => {
    const { poll_id } = req.params;  // poll_id should be from URL params
    const { title, deleted = 0 } = req.body;  // default deleted to 0
    
    if (!poll_id || !title) {
      return res.status(400).json({ error: "Poll ID and Title are required" });
    }
    
    try {
      const answerId = await createPollAnswer({ poll_id, title, deleted });
      res.status(201).json({ message: "Poll answer created successfully", answerId });
    } catch (error) {
      console.error("Error creating poll answer:", error);
      res.status(500).json({ error: "Failed to create poll answer" });
    }
  };
  
  export const getPollAnswersByIdController = async (req, res) => {
    const { poll_id } = req.params;  // poll_id should be from URL params
    
    if (!poll_id) {
      return res.status(400).json({ error: "Poll ID is required" });
    }
  
    try {
      const answers = await getPollAnswersByPollId(poll_id);
      
      if (answers.length === 0) {
        return res.status(404).json({ message: "No poll answers found for this poll ID" });
      }
  
      res.status(200).json({ pollId: poll_id, answers });
    } catch (error) {
      console.error("Error fetching poll answers:", error);
      res.status(500).json({ error: "Failed to fetch poll answers" });
    }
  };
  

// Create a poll vote
export const createPollVoteController = async (req, res) => {
    const { poll_id, poll_answer_id, created_by, created_at = new Date(), deleted = 0 } = req.body; // Set default values for created_at and deleted
    
    if (!poll_id || !poll_answer_id || !created_by) {
      return res.status(400).json({ error: "Poll ID, Poll Answer ID, and Created By are required" });
    }
    
    try {
      const voteId = await createPollVote({ poll_id, poll_answer_id, created_by, created_at, deleted });
      res.status(201).json({ message: "Vote created successfully", voteId });
    } catch (error) {
      console.error("Error creating poll vote:", error);
      res.status(500).json({ error: "Failed to create poll vote" });
    }
  };
  

//   export const getPollVotesController = async (req, res) => {
//     const { pollId } = req.params;
//     try {
//       const votes = await getPollVotes(pollId);  // fetch votes for the poll
//       res.status(200).json(votes);  // send the result
//     } catch (error) {
//       console.error("Error fetching poll votes:", error);
//       res.status(500).json({ error: "Failed to fetch poll votes" });
//     }
//   };
  

export const getPollVotesController = async (req, res) => {
    const { poll_id } = req.params;  // Extract poll_id from URL parameters
  
    // Check if poll_id is provided
    if (!poll_id) {
      return res.status(400).json({ error: "Poll ID is required" });
    }
  
    try {
      // Fetch the poll votes using the model
      const votes = await getPollVotes(poll_id);
      
      if (votes.length === 0) {
        return res.status(404).json({ message: "No votes found for this poll" });
      }
  
      res.status(200).json(votes);  // Return the list of votes as a response
    } catch (error) {
      console.error("Error fetching poll votes:", error);
      res.status(500).json({ error: "Failed to fetch poll votes" });
    }
  };