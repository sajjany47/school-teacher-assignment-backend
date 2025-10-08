import express from "express";
import { login, userList, userSignUp } from "../api/user/auth.controller.js";
import { tokenValidation } from "../middleware/auth.middileware.js";

const UserRoutes = express.Router();

UserRoutes.route("/register").post(userSignUp);
UserRoutes.route("/login").post(login);
UserRoutes.route("/list").post(tokenValidation, userList);

export default UserRoutes;
