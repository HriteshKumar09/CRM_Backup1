// Task Priority Controllers
export const getAllTaskPrioritiesController = async (req, res) => {
  try {
    const priorities = await getAllTaskPriorities();
    res.status(200).json({
      success: true,
      data: priorities
    });
  } catch (error) {
    console.error('Error in getAllTaskPrioritiesController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task priorities'
    });
  }
};

export const getTaskPriorityByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const priority = await getTaskPriorityById(id);
    res.status(200).json({
      success: true,
      data: priority
    });
  } catch (error) {
    console.error('Error in getTaskPriorityByIdController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task priority'
    });
  }
};

// Task Status Controllers
export const getAllTaskStatusesController = async (req, res) => {
  try {
    const statuses = await getAllTaskStatuses();
    res.status(200).json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('Error in getAllTaskStatusesController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task statuses'
    });
  }
};

export const getTaskStatusByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await getTaskStatusById(id);
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error in getTaskStatusByIdController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task status'
    });
  }
}; 