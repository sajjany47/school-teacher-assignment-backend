import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
});

const STATUS = ["Draft", "Published", "Completed"];

const AssignmentModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, trim: true, default: "" },
    dueDate: { type: Date },
    status: { type: String, enum: STATUS, default: "Draft" },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isdeleted: { type: Boolean, default: false }, // soft delete flag (optional)
  },
  { timestamps: true }
);

const Assignment = mongoose.model("assignment", AssignmentModel);

export default Assignment;
