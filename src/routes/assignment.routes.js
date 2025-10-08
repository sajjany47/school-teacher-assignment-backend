import express from "express";
import {
  addAssignment,
  deleteAssignment,
  editAssignment,
  listAssignments,
} from "../api/assignment/assignment.controller.js";
import { tokenValidation } from "../middleware/auth.middileware.js";
import {
  getStudentAssignmentDetails,
  reviewSubmission,
  submitAssignment,
} from "../api/submission/submission.controller.js";

const assignmentRouter = express.Router();

assignmentRouter.route("/create").post(tokenValidation, addAssignment);
assignmentRouter.route("/edit").post(tokenValidation, editAssignment);
assignmentRouter.route("/:id").delete(tokenValidation, deleteAssignment);
assignmentRouter.route("/datatable").post(tokenValidation, listAssignments);
assignmentRouter
  .route("/:assignmentId/student/:studentId")
  .get(tokenValidation, getStudentAssignmentDetails);
assignmentRouter
  .route("/student-submit")
  .post(tokenValidation, submitAssignment);
assignmentRouter
  .route("/review-teacher")
  .post(tokenValidation, reviewSubmission);

export default assignmentRouter;
