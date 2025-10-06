import jwt from "jsonwebtoken";
import { ErrorResponse } from "../util.js";

export const tokenValidation = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader)
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });

    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Invalid token format." });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    ErrorResponse(error, res);
    // return res.status(403).json({ message: "Invalid or expired token." });
  }
};
