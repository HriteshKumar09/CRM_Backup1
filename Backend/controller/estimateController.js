import { createComment, createEstimate, createEstimateForm, createEstimateItem, createEstimateRequest, createProposal, createProposalItem, deleteComment, deleteEstimate, deleteEstimateForm, deleteEstimateItem, deleteEstimateRequest, deleteProposal, deleteProposalItem, deleteProposalTemplate, getAllEstimateForms, getAllEstimateItems, getAllEstimateRequests, getAllProposals, getCommentsByEstimate, getEstimateById, getEstimateFormById, getEstimateRequestById, getEstimates, getProposalById, getProposalItemsByProposalId, getProposalTemplateById, updateComment, updateEstimate, updateEstimateForm, updateEstimateItem, updateEstimateRequest, updateProposal, updateProposalItem, updateProposalTemplate } from "../model/EstimateModel.js";


// Create Estimate Form
export const createEstimateFormController = async (req, res) => {
    try {
        const result = await createEstimateForm(req.body);
        res.status(201).json({
            success: true,
            message: "Estimate Form Created Successfully",
            formId: result.insertId,
        });
    } catch (error) {
        console.error("❌ Error in createEstimateForm:", error);
        res.status(500).json({ success: false, message: "Failed to create estimate form", error: error.message });
    }
};

// Get All Estimate Forms
export const getAllEstimateFormsController = async (req, res) => {
    try {
        const forms = await getAllEstimateForms();
        res.status(200).json({ success: true, forms });
    } catch (error) {
        console.error("❌ Error in getAllEstimateForms:", error);
        res.status(500).json({ success: false, message: "Failed to get estimate forms", error: error.message });
    }
};

// Get Single Form by ID
export const getEstimateFormByIdController = async (req, res) => {
    try {
        const form = await getEstimateFormById(req.params.id);
        if (!form) {
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error("❌ Error in getEstimateFormById:", error);
        res.status(500).json({ success: false, message: "Failed to get estimate form", error: error.message });
    }
};

// Update Form
export const updateEstimateFormController = async (req, res) => {
    try {
        const result = await updateEstimateForm(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Estimate Form Updated Successfully" });
    } catch (error) {
        console.error("❌ Error in updateEstimateForm:", error);
        res.status(500).json({ success: false, message: "Failed to update estimate form", error: error.message });
    }
};

// Delete Form
export const deleteEstimateFormController = async (req, res) => {
    try {
        await deleteEstimateForm(req.params.id);
        res.status(200).json({ success: true, message: "Estimate Form Deleted Successfully" });
    } catch (error) {
        console.error("❌ Error in deleteEstimateForm:", error);
        res.status(500).json({ success: false, message: "Failed to delete estimate form", error: error.message });
    }
};


{/*Estimate Requests */}

// Create Estimate Request
export const createRequest = async (req, res) => {
    try {
        const result = await createEstimateRequest(req.body);
        res.status(201).json({ success: true, requestId: result.requestId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get All Requests
export const getRequests = async (req, res) => {
    try {
        const requests = await getAllEstimateRequests(req.query);
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get Request By ID
export const getRequestById = async (req, res) => {
    try {
        const request = await getEstimateRequestById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        res.json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update Request
export const updateRequest = async (req, res) => {
    try {
        await updateEstimateRequest(req.params.id, req.body);
        res.json({ success: true, message: 'Request updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete Request
export const deleteRequest = async (req, res) => {
    try {
        await deleteEstimateRequest(req.params.id);
        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


{/*Estimates */}

// Controller to create a new estimate
export const createEstimateController = async (req, res) => {
    try {
      const requestData = req.body;
      const result = await createEstimate(requestData);
      res.status(201).json({
        success: true,
        message: 'Estimate created successfully',
        data: result
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to create estimate',
        error: err.message
      });
    }
  };
  
  // Controller to fetch all estimates
  export const getEstimatesController = async (req, res) => {
    try {
      const estimates = await getEstimates();
      res.status(200).json({
        success: true,
        data: estimates
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch estimates',
        error: err.message
      });
    }
  };
  
  // Controller to fetch an estimate by ID
  export const getEstimateByIdController = async (req, res) => {
    const { id } = req.params;
    try {
      const estimate = await getEstimateById(id);
      if (estimate) {
        res.status(200).json({
          success: true,
          data: estimate
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Estimate not found'
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch estimate',
        error: err.message
      });
    }
  };
  
  // Controller to update an existing estimate
  export const updateEstimateController = async (req, res) => {
    const { id } = req.params;
    const requestData = req.body;
    try {
      const result = await updateEstimate(id, requestData);
      if (result.affectedRows > 0) {
        res.status(200).json({
          success: true,
          message: 'Estimate updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Estimate not found'
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to update estimate',
        error: err.message
      });
    }
  };
  
  // Controller to delete an estimate
  export const deleteEstimateController = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteEstimate(id);
      if (result.affectedRows > 0) {
        res.status(200).json({
          success: true,
          message: 'Estimate deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Estimate not found'
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Failed to delete estimate',
        error: err.message
      });
    }
  };


  {/*Estimate Items */}


// Create Item Controller
export const createItem = async (req, res) => {
    try {
        const result = await createEstimateItem(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create estimate item', error });
    }
};

// Get All Items for Specific Estimate
export const getItemsByEstimate = async (req, res) => {
    const { estimate_id } = req.params;
    try {
        const items = await getAllEstimateItems(estimate_id);
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch estimate items', error });
    }
};

// Update Item Controller
export const updateItem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await updateEstimateItem(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update estimate item', error });
    }
};

// Soft Delete Item Controller
export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteEstimateItem(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete estimate item', error });
    }
};

////////////////
{/*Estimate Comments */}
///////////////


// Create Comment
export const createCommentController = async (req, res) => {
    try {
        const result = await createComment(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create comment', error });
    }
};

// Get Comments for Specific Estimate
export const getCommentsController = async (req, res) => {
    const { estimate_id } = req.params;
    try {
        const comments = await getCommentsByEstimate(estimate_id);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch comments', error });
    }
};

// Update Comment
export const updateCommentController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await updateComment(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update comment', error });
    }
};

// Delete Comment
export const deleteCommentController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteComment(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete comment', error });
    }
};



/////////////
{/*Estimate Proposals*/}
// ➕ Create Proposal
export const createProposalController = async (req, res) => {
  try {
      const proposalData = req.body;
      const result = await createProposal(proposalData);
      res.status(201).json({ success: true, message: 'Proposal created successfully', proposalId: result.proposalId });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create proposal', error });
  }
};

// 📄 Get Proposal By ID
export const getProposalByIdController = async (req, res) => {
  try {
      const { id } = req.params;
      const proposal = await getProposalById(id);
      if (proposal) {
          res.status(200).json({ success: true, proposal });
      } else {
          res.status(404).json({ success: false, message: 'Proposal not found' });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch proposal', error });
  }
};

// 📝 Update Proposal
export const updateProposalController = async (req, res) => {
  try {
      const { id } = req.params;
      const proposalData = req.body;
      await updateProposal(id, proposalData);
      res.status(200).json({ success: true, message: 'Proposal updated successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update proposal', error });
  }
};

// 🗑️ Delete Proposal (Soft Delete)
export const deleteProposalController = async (req, res) => {
  try {
      const { id } = req.params;
      await deleteProposal(id);
      res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete proposal', error });
  }
};

// 📋 List All Proposals
export const getAllProposalsController = async (req, res) => {
  try {
      const proposals = await getAllProposals();
      res.status(200).json({ success: true, proposals });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch proposals', error });
  }
};

////////////////
{/*Estimate proposal items*/}
////////////////
// 📌 1️⃣ Get all items for a specific proposal
export const getProposalItems = async (req, res) => {
  try {
      const proposalId = req.params.id;
      const items = await getProposalItemsByProposalId(proposalId);
      res.json({ success: true, items });
  } catch (error) {
      console.error("❌ Error fetching proposal items:", error);
      res.status(500).json({ success: false, message: "Error fetching proposal items", error });
  }
};

// 📌 2️⃣ Add a new item to a proposal
export const addProposalItem = async (req, res) => {
  try {
      const proposalId = req.params.id;
      const itemData = req.body;
      const result = await createProposalItem(proposalId, itemData);
      res.json({ success: true, itemId: result.itemId });
  } catch (error) {
      console.error("❌ Error adding proposal item:", error);
      res.status(500).json({ success: false, message: "Error adding proposal item", error });
  }
};

// 📌 3️⃣ Update an existing proposal item
export const editProposalItem = async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const itemData = req.body;
      await updateProposalItem(itemId, itemData);
      res.json({ success: true, message: "Proposal item updated successfully" });
  } catch (error) {
      console.error("❌ Error updating proposal item:", error);
      res.status(500).json({ success: false, message: "Error updating proposal item", error });
  }
};

// 📌 4️⃣ Soft delete a proposal item
export const removeProposalItem = async (req, res) => {
  try {
      const itemId = req.params.itemId;
      await deleteProposalItem(itemId);
      res.json({ success: true, message: "Proposal item deleted successfully" });
  } catch (error) {
      console.error("❌ Error deleting proposal item:", error);
      res.status(500).json({ success: false, message: "Error deleting proposal item", error });
  }
};

/////////////
{/*Proposal Templates*/}
/////////////

// 📌 1️⃣ Get a single proposal template by ID
export const getProposalTemplate = async (req, res) => {
  try {
      const templateId = req.params.id;
      const template = await getProposalTemplateById(templateId);

      if (!template) {
          return res.status(404).json({ success: false, message: "Template not found" });
      }

      res.json({ success: true, template });
  } catch (error) {
      console.error("❌ Error fetching proposal template:", error);
      res.status(500).json({ success: false, message: "Error fetching proposal template", error });
  }
};

// 📌 2️⃣ Update an existing proposal template
export const editProposalTemplate = async (req, res) => {
  try {
      const templateId = req.params.id;
      const { title, template } = req.body;

      if (!title || !template) {
          return res.status(400).json({ success: false, message: "Title and template content are required" });
      }

      await updateProposalTemplate(templateId, { title, template });
      res.json({ success: true, message: "Template updated successfully" });
  } catch (error) {
      console.error("❌ Error updating proposal template:", error);
      res.status(500).json({ success: false, message: "Error updating proposal template", error });
  }
};

// 📌 3️⃣ Soft delete a proposal template
export const removeProposalTemplate = async (req, res) => {
  try {
      const templateId = req.params.id;
      await deleteProposalTemplate(templateId);
      res.json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
      console.error("❌ Error deleting proposal template:", error);
      res.status(500).json({ success: false, message: "Error deleting proposal template", error });
  }
};
