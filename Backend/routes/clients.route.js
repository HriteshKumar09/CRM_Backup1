import express from 'express';
import {
  createClientController,
  getClientsController,
  getClientByIdController,
  updateClientController,
  deleteClientController,
  addClientToGroupController,
  removeClientFromGroupController,
  moveClientToAnotherGroupController,
  softDeleteClientFromGroupController
} from '../controller/clients.controller.js';
import { getProjectsByClientId } from '../controller/project.controller.js';

const router = express.Router();

// Client Group Management Routes
// Make sure these routes come before the more generic /clients/:id route

// Route to add a client to a group
router.post('/clients/add-to-group', addClientToGroupController);

// Route to remove a client from a group
router.put('/clients/remove-from-group', removeClientFromGroupController);

// Route to move a client from one group to another
router.put('/clients/move-to-group', moveClientToAnotherGroupController);

// Route to soft delete a client from a group (remove from group but keep the client)
router.delete('/clients/soft-delete-from-group', softDeleteClientFromGroupController);

// Route to create a new client
router.post('/clients', createClientController);

// Route to get all clients
router.get('/clients', getClientsController);

// Route to get a specific client by ID
router.get('/clients/:id', getClientByIdController);

// ✅ Route to get projects by client ID
router.get("/projects/client/:clientId", getProjectsByClientId);

// Route to update a client
router.put('/clients/:id', updateClientController);

// Route to soft delete a client (set deleted = 1)
router.delete('/clients/:id', deleteClientController);

export default router;
