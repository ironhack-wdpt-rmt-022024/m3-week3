const express = require("express");
const router = express.Router();
// IMPORT MODELS
const Project = require("./../models/Project.model");
const Task = require("./../models/Task.model");

// Authentication middleware - for protecting routes
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// 1. create the async function:
// async function () {}
// async () => {}

// 2. add a try/catch block
// as a way to handle errors

// 3. Use `await` inside of the async function
// await replaces our `then` blocks - used to resolve the promise


// POST  /api/tasks - Create a new task
router.post("/tasks", isAuthenticated, async (req, res, next) => {
  try {
    // Get the request body data
    const { title, description, projectId } = req.body;
  
    // Check/validate the ObjectId passed in the request
    if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
        res.status(400).json({  message: "Specified id is not valid" })
        return;
    }

    const createdTask = await Task.create({ title: title, description: description, project: projectId });
    const updatedProject = await Project.findByIdAndUpdate(projectId, { $push: { tasks: createdTask._id } }, { new: true });
    
    // Send the response back
    res.status(201).json(updatedProject); // 201 Created
  }
  catch (error) {
    // Forward the error to  the error-handling middleware
    next(error); 
  }

  
})

module.exports = router;