import * as yup from "yup";

export const submissionValidationSchema = yup.object().shape({
  assignmentId: yup
    .string()
    .required("Assignment ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid assignment ID format"),

  studentId: yup
    .string()
    .required("Student ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),

  answers: yup
    .array()
    .of(
      yup.object().shape({
        questionId: yup.string().required("Question ID is required"),
        answerText: yup
          .string()
          .trim()
          .min(1, "Answer cannot be empty")
          .required("Answer text is required"),
      })
    )
    .min(1, "At least one answer must be provided")
    .required("Answers are required"),
});

export const reviewValidator = yup.object().shape({
  marksObtained: yup
    .number()
    .min(0, "Marks cannot be negative")
    .required("Marks are required"),
  totalMarks: yup.string().required("Total marks is required"),
  marksObtained: yup.string().required("mMrks Obtained is required"),
});
