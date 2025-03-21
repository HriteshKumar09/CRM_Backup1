import express from "express";
import { 
    createPollController, 
    getAllPollsController, 
    getPollByIdController, 
    updatePollByIdController, 
    deletePollByIdController, 
    createPollAnswerController, 
    createPollVoteController, 
    getPollVotesController, 
    getPollAnswersByIdController
} from "../controller/polls.controller.js"; // Adjust the path based on your directory structure

const router = express.Router();

// Poll routes
router.post("/polls", createPollController); // Create a new poll
router.get("/polls", getAllPollsController); // Get all polls
router.get("/polls/:id", getPollByIdController); // Get a specific poll by id
router.put("/polls/:id", updatePollByIdController); // Update a poll by id
router.delete("/polls/:id", deletePollByIdController); // Delete a poll by id

// Poll Answer routes
router.post("/polls/:poll_id/answers", createPollAnswerController); // Create poll answers
router.get("/polls/:poll_id/answers", getPollAnswersByIdController); // get all answers for a poll

// Poll Vote routes
router.post("/polls/:poll_id/votes", createPollVoteController); // Store votes for answers
router.get("/polls/:poll_id/votes", getPollVotesController); // Get all votes for a poll

export default router;
