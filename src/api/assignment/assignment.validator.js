import * as yup from "yup";

const STATUS_ENUM = ["Draft", "Published", "Completed"];

const questionSchema = yup.object({
  question: yup.string().trim().required("Question text is required"),
});

export const assignmentSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().notRequired(),
  dueDate: yup.date().nullable().notRequired(),
  status: yup.string().oneOf(STATUS_ENUM).default("Draft"),
  questions: yup.array().of(questionSchema).min(0).notRequired(),
});
