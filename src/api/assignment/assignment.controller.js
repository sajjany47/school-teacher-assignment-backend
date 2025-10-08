import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../util.js";
import Assignment from "./assignment.model.js";
import { assignmentSchema } from "./assignment.validator.js";
import Submission from "../submission/submission.model.js";
import mongoose from "mongoose";

export const addAssignment = async (req, res) => {
  try {
    const validated = await assignmentSchema.validate(req.body);

    const newAssignment = new Assignment({
      ...validated,
      createdBy: req.user?._id,
      isdeleted: false,
    });

    const saved = await newAssignment.save();

    return res.status(StatusCodes.CREATED).json({
      message: "Assignment created successfully",
      data: saved,
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};

//  EDIT Assignment
export const editAssignment = async (req, res) => {
  try {
    const validated = await assignmentSchema.validate(req.body);

    const updated = await Assignment.findOneAndUpdate(
      { _id: validated._id, isdeleted: false },
      { ...validated, updatedBy: req.user?._id },
      { new: true }
    );

    if (!updated)
      return ErrorResponse(
        { message: "Assignment not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );

    return res.status(StatusCodes.OK).json({
      message: "Assignment updated successfully",
      data: updated,
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};

//  DELETE Assignment (Soft Delete)
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Assignment.findOneAndUpdate(
      { _id: id, isdeleted: false },
      { isdeleted: true, updatedBy: req.user?._id },
      { new: true }
    );

    if (!deleted)
      return ErrorResponse(
        { message: "Assignment not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );

    return res.status(StatusCodes.OK).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};

//  LIST + FILTER + PAGINATION
export const listAssignments = async (req, res) => {
  try {
    const reqData = req.body;
    const page = reqData.page;
    const limit = reqData.limit;
    const start = page * limit - limit;
    const query = [{ isdeleted: false }];
    if (reqData.hasOwnProperty("status") && reqData.status) {
      query.push({ status: reqData.status });
    }

    const data = await Promise.all([
      Assignment.countDocuments([
        { $match: query.length > 0 ? { $and: query } : {} },
      ]),
      Assignment.aggregate([
        { $match: query.length > 0 ? { $and: query } : {} },
        {
          $sort: reqData.hasOwnProperty("sort")
            ? reqData.sort
            : {
                title: 1,
              },
        },
        { $skip: start },
        { $limit: limit },
      ]),
    ]);

    let newData = data[1];

    if (req.user.position === "student") {
      const findAssignmentSubmission = await Submission.find({
        studentId: new mongoose.Types.ObjectId(req.user._id),
      });
      newData = data[1].map((item) => {
        const findAssignment = findAssignmentSubmission.find(
          (elm) => elm.assignmentId.toString() === item?._id.toString()
        );
        return {
          ...item,
          submissionDetails: findAssignment ?? null,
          status: findAssignment?.status ?? null,
          marks: findAssignment?.marksObtained
            ? `${findAssignment.marksObtained}/${findAssignment.totalMarks}`
            : "",
          isSubmit: findAssignment ? true : false,
        };
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Data fetched successfully",
      data: newData,
      count: data[0],
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};
