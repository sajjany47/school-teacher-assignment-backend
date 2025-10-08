import { StatusCodes } from "http-status-codes";

import Assignment from "../assignment/assignment.model.js";
import Submission from "./submission.model.js";
import {
  reviewValidator,
  submissionValidationSchema,
} from "./submission.validator.js";

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

    const { submissionId, marksObtained, teacherId } = validatedData;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return ErrorResponse(
        { message: "Submission not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );
    }

    submission.marksObtained = marksObtained;
    submission.reviewedBy = teacherId;
    submission.status = "reviewed";
    submission.reviewedAt = new Date();
    submission.feedback = feedback;

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

    const assignment = await Assignment.findById(assignmentId)
      .populate("createdBy", "name position email")
      .lean();

    if (!assignment) {
      return ErrorResponse(
        { message: "Assignment not found", statusCode: StatusCodes.NOT_FOUND },
        res
      );
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId,
    })
      .populate("reviewedBy", "name position email")
      .lean();

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
