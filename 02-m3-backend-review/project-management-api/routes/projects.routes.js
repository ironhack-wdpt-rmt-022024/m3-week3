// routes/projects.routes.js
const express = require("express");
const router = express.Router();
// IMPORT MODELS
const Project = require("./../models/Project.model");
const Task = require("./../models/Task.model");

// Authentication middleware - for protecting routes
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// POST   /api/projects - Create a new project in the DB
router.post("/projects", isAuthenticated, async (req, res, next) => {
    try {
        // Get the request body to use it to create a project document
        const { title, description } = req.body;
    
        // Call DB to create a new project, and await for the promise to resolve
        const createdProject = await Project.create({ title: title, description: description, tasks: [], })
        
        // Return back the response with the created project
        res.json(createdProject);
    }
    catch (error) {
        next(err)
    }

})

// GET   /api/projects - Get all project from the DB
router.get("/projects", isAuthenticated, async (req, res, next) => {
    try {
        const allProjects = await Project.find().populate("tasks");
        res.json(allProjects);
    }
    catch (error) {
        next(err);
    }
})

//  GET   /api/projects/:projectId - Get one project doc by its id
router.get("/projects/:projectId", isAuthenticated, async (req, res, next)  => {
    try {
        // Get the document id
        const projectId = req.params.projectId;
    
        // Check/validate the ObjectId passed in the request
        if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
            res.status(400).json({  message: "Specified id is not valid" })
            return;
        }
    
        const oneProject = await Project.findById(projectId).populate("tasks");
        res.json(oneProject);
    }
    catch (error) {
        next(err)
    }
})


// PUT  /api/projects/:projectId  -  Update a specific project by id
router.put("/projects/:projectId", isAuthenticated, async (req, res, next) => {
    try {
        // Get the document id
        const projectId = req.params.projectId;
    
        // Check/validate the ObjectId passed in the request
        if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
            res.status(400).json({  message: "Specified id is not valid" })
            return;
        }
    
        // Get the values from the request body for update
        const { title, description } = req.body;
    
        // Find the project document by id and update it
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { title: title, description: description },
            { new: true } // Tells mongoose to return the updated version of the document
        )

        res.json(updatedProject); // Status Code 200 - Success
    }
    catch (error) {
        next(err);
    }
})


// DELETE  /api/projects/:projectId  -  Delete a specific project by id
router.delete("/projects/:projectId", isAuthenticated, async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
      
          // Check/validate the ObjectId passed in the request
          if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
              res.status(400).json({  message: "Specified id is not valid" })
              return;
          }  
      
        const deletedProject = await Project.findByIdAndDelete(projectId);
        res.status(204).send(); // 204 No Content
    }
    catch (error) {
        next(err);
    }
})

module.exports = router;