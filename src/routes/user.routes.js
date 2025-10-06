import express from "express";
import { login, userSignUp } from "../api/user/auth.controller.js";

const UserRoutes = express.Router();

UserRoutes.route("/register").post(userSignUp);
UserRoutes.route("/login").post(login);

export default UserRoutes;
