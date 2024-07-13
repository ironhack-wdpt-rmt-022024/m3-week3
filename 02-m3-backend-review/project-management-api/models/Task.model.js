const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE A SCHEMA
const taskSchema = new Schema({
    title: String,
    description: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" }
})


// CREATE A MODEL
const Task = mongoose.model("Task", taskSchema)


// EXPORT THE MODEL
module.exports = Task;