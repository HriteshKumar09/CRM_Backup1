import { createClient, getClients, getClientById, updateClient, deleteClient, addClientToGroup, removeClientFromGroup, moveClientToAnotherGroup, createClientGroup, getAllClientGroups, updateClientGroup, deleteClientGroup } from "../model/clients.model.js";

// Helper function to validate request data
const validateRequestData = (data) => {
  if (!data.company_name) throw new Error("Company name is required");
  if (!data.type) throw new Error("Client type is required");
  // ...additional validation logic...
};

// Controller to handle the creation of a client
export const createClientController = async (req, res) => {
  try {
    const clientData = req.body;
    validateRequestData(clientData); // Validate request data
    const result = await createClient(clientData);

    // Send a response with the client ID and any other relevant data
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        clientId: result.insertId, // ID of the newly created client
        ...clientData, // You can also return the client data that was inserted
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle fetching all clients
export const getClientsController = async (req, res) => {
  try {
    const clients = await getClients();
    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle fetching a client by ID
export const getClientByIdController = async (req, res) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const client = await getClientById(clientId); 

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle updating a client
export const updateClientController = async (req, res) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const clientData = req.body;
    validateRequestData(clientData); // Validate request data

    // Perform the update
    const result = await updateClient(clientId, clientData);

    // Check if the update was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Fetch the updated client data
    const updatedClient = await getClientById(clientId);

    // Respond with the updated data
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient, // Send updated client data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle soft deleting a client
export const deleteClientController = async (req, res) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const result = await deleteClient(clientId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle adding a client to a group
export const addClientToGroupController = async (req, res) => {
  try {
    const { clientId, groupId } = req.body;
    const result = await addClientToGroup(clientId, groupId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle removing a client from a group
export const removeClientFromGroupController = async (req, res) => {
  try {
    const { clientId, groupId } = req.body;
    const result = await removeClientFromGroup(clientId, groupId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle moving a client from one group to another
export const moveClientToAnotherGroupController = async (req, res) => {
  try {
    const { clientId, fromGroupId, toGroupId } = req.body;
    const result = await moveClientToAnotherGroup(clientId, fromGroupId, toGroupId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Controller to handle soft deleting a client from a group
export const softDeleteClientFromGroupController = async (req, res) => {
  try {
    const { clientId, groupId } = req.body;
    const result = await softDeleteClientFromGroup(clientId, groupId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
};

// Client Groups Controllers

// Create a new client group
export const createClientGroupController = async (req, res) => {
  try {
    const groupData = req.body;
    
    if (!groupData.title || !groupData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group title is required'
      });
    }

    const result = await createClientGroup(groupData);
    
    res.status(201).json({
      success: true,
      message: 'Client group created successfully',
      groupId: result.groupId
    });
  } catch (error) {
    console.error('Error in createClientGroupController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create client group'
    });
  }
};

// Get all client groups
export const getAllClientGroupsController = async (req, res) => {
  try {
    const result = await getAllClientGroups();
    
    res.status(200).json({
      success: true,
      groups: result.data
    });
  } catch (error) {
    console.error('Error in getAllClientGroupsController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch client groups'
    });
  }
};

// Update a client group
export const updateClientGroupController = async (req, res) => {
  try {
    const { id } = req.params;
    const groupData = req.body;
    
    if (!groupData.title || !groupData.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group title is required'
      });
    }

    const result = await updateClientGroup(id, groupData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client group not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client group updated successfully'
    });
  } catch (error) {
    console.error('Error in updateClientGroupController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update client group'
    });
  }
};

// Delete a client group
export const deleteClientGroupController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteClientGroup(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client group not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client group deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteClientGroupController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete client group'
    });
  }
};