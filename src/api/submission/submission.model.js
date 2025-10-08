import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment.questions", // optional: refers to question in assignment
      required: true,
    },
    answerText: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one answer is required.",
      },
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher
      default: null,
    },
    status: {
      type: String,
      enum: ["submitted", "reviewed"],
      default: "submitted",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
