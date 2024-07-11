// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");

// Authentication middleware - for protecting routes
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// ROUTES
const projectsRoutes = require('./routes/projects.routes');
app.use('/api', projectsRoutes)

const tasksRoutes = require('./routes/tasks.routes')
app.use('/api', tasksRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
