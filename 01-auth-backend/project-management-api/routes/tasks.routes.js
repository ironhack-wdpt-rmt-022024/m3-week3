const express = require("express");
const router = express.Router();
// IMPORT MODELS
const Project = require("./../models/Project.model");
const Task = require("./../models/Task.model");

// Authentication middleware - for protecting routes
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// POST  /api/tasks - Create a new task
router.post("/tasks", isAuthenticated, (req, res, next) => {
    // Get the request body data
    const { title, description, projectId } = req.body;

    // Check/validate the ObjectId passed in the request
    if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
        res.status(400).json({  message: "Specified id is not valid" })
        return;
    }    
    
    Task.create({ title: title, description: description, project: projectId })
      .then((createdTask) => {
        // Once the task is created
        // Find the related project the task belongs to
        // and update it to add task ObjectId to tasks array
        return Project.findByIdAndUpdate(projectId, { $push: { tasks: createdTask._id } }, { new: true })
      })
      .then((updatedProject) => {
        // Send the response back
        res.status(201).json(updatedProject); // 201 Created
      })
})

module.exports = router;