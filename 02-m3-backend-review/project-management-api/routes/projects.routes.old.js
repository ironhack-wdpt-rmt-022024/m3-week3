// routes/projects.routes.js
const express = require("express");
const router = express.Router();
// IMPORT MODELS
const Project = require("./../models/Project.model");
const Task = require("./../models/Task.model");

// Authentication middleware - for protecting routes
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// POST   /api/projects - Create a new project in the DB
router.post("/projects", isAuthenticated, (req, res, next) => {
    const { title, description } = req.body;

    Project.create({ 
        title: title,
        description: description, 
        tasks: [],
    })
    .then((createdProject) => {
        res.json(createdProject)
    })
    .catch((err) => {
        next(err)
    })
})

// GET   /api/projects - Get all project from the DB
router.get("/projects", isAuthenticated, (req, res, next) => {
    Project.find()
      .populate("tasks")
      .then((allProjects) => {
        res.json(allProjects)
      })
      .catch((err) => {
        next(err);
      })
})

//  GET   /api/projects/:projectId - Get one project doc by its id
router.get("/projects/:projectId", isAuthenticated, (req, res, next)  => {
    // Get the document id
    const projectId = req.params.projectId;

    // Check/validate the ObjectId passed in the request
    if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
        res.status(400).json({  message: "Specified id is not valid" })
        return;
    }

    Project.findById(projectId)
      .populate("tasks")
      .then((oneProject) => {
        res.json(oneProject)
      })
      .catch((err) => {
        next(err)
      })
})


// PUT  /api/projects/:projectId  -  Update a specific project by id
router.put("/projects/:projectId", isAuthenticated, (req, res, next) => {
    // Get the document id
    const projectId = req.params.projectId;

    // Check/validate the ObjectId passed in the request
    if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
        res.status(400).json({  message: "Specified id is not valid" })
        return;
    }

    // Get the values from the request body for update
    const { title, description } = req.body;

    Project.findByIdAndUpdate(
        projectId,
        { title: title, description: description },
        { new: true } // Tells mongoose to return the updated version of the document
    )
    .then((updatedProject) => {
        res.json(updatedProject); // Status Code 200 - Success
    })
    .catch((err) => {
        next(err);
    })
})


// DELETE  /api/projects/:projectId  -  Delete a specific project by id
router.delete("/projects/:projectId", isAuthenticated, (req, res, next) => {
  const projectId = req.params.projectId;

    // Check/validate the ObjectId passed in the request
    if ( mongoose.Types.ObjectId.isValid(projectId) === false ) {
        res.status(400).json({  message: "Specified id is not valid" })
        return;
    }  

  Project.findByIdAndDelete(projectId)
    .then((deletedProject) => {
        res.status(204).send(); // 204 No Content
    })
    .catch((err) => {
        next(err);
    })
})

module.exports = router;