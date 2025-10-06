import * as Yup from "yup";

export const userSignUpValidator = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().required("Email is required"),
  position: Yup.string()
    .oneOf(["teacher", "student"])
    .required("Position is required"),
});

export const userSigninValidator = Yup.object().shape({
  email: Yup.string().required("email is required"),
  password: Yup.string().required("Password is required"),
});
