const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE A SCHEMA
const projectSchema = new Schema({
    title: String,
    description: String,
    tasks: [ { type: Schema.Types.ObjectId, ref: 'Task' } ]
  }
)

// CREATE A MODEL
//                              Project -> projects
const Project = mongoose.model("Project", projectSchema);


// EXPORT THE MODEL
module.exports = Project;