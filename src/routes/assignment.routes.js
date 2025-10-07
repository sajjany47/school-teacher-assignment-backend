import express from "express";
import {
  addAssignment,
  deleteAssignment,
  editAssignment,
  listAssignments,
} from "../api/assignment/assignment.controller.js";
import { tokenValidation } from "../middleware/auth.middileware.js";

const assignmentRouter = express.Router();

assignmentRouter.route("/create").post(tokenValidation, addAssignment);
assignmentRouter.route("/edit").post(tokenValidation, editAssignment);
assignmentRouter.route("/:id").delete(tokenValidation, deleteAssignment);
assignmentRouter.route("/datatable").post(tokenValidation, listAssignments);

export default assignmentRouter;
