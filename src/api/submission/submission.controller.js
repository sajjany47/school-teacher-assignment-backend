import { StatusCodes } from "http-status-codes";

import Assignment from "../assignment/assignment.model.js";
import Submission from "./submission.model.js";
import {
  reviewValidator,
  submissionValidationSchema,
} from "./submission.validator.js";
import { ErrorResponse } from "../../util.js";

export const submitAssignment = async (req, res) => {
  try {
    const validatedData = await submissionValidationSchema.validate(req.body);

    const { assignmentId, studentId, answers } = validatedData;

    // Check if student already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId,
    });
    if (existingSubmission) {
      return ErrorResponse(
        {
          message: "Assignment already submitted",
          statusCode: StatusCodes.BAD_REQUEST,
        },
        res
      );
    }

    const newSubmission = await Submission.create({
      assignmentId,
      studentId,
      answers,
      status: "submitted",
      submittedAt: new Date(),
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Assignment submitted successfully",
      data: newSubmission,
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};

export const reviewSubmission = async (req, res) => {
  try {
    const validatedData = await reviewValidator.validate(req.body);

    const { submissionId, marksObtained, totalMarks } = validatedData;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return ErrorResponse(
        { message: "Submission not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );
    }

    submission.marksObtained = marksObtained;
    submission.totalMarks = totalMarks;
    submission.reviewedBy = req.user._id;
    submission.status = "reviewed";
    submission.reviewedAt = new Date();

    await submission.save();

    return res.status(StatusCodes.OK).json({
      message: "Submission reviewed successfully",
      data: submission,
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};

export const getStudentAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return ErrorResponse(
        { message: "Assignment not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId,
    });

    const questionsWithAnswers = assignment.questions.map((q) => {
      const answer = submission?.answers?.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      return {
        questionId: q._id,
        question: q.question,
        answerText: answer ? answer.answerText : null,
      };
    });

    const responseData = {
      studentId: studentId,
      assignmentId: assignment._id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: assignment.status,
      createdBy: assignment.createdBy,
      questions: questionsWithAnswers,
      submissionStatus: submission ? submission.status : "not_submitted",
      submissionId: submission._id,
      marksObtained: submission ? submission.marksObtained : null,
      reviewedBy: submission ? submission.reviewedBy : null,
      submittedAt: submission ? submission.submittedAt : null,
      reviewedAt: submission ? submission.reviewedAt : null,
    };

    // 4️⃣ Return final merged result
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Assignment details fetched successfully",
      data: responseData,
    });
  } catch (error) {
    ErrorResponse(error, res);
  }
};
