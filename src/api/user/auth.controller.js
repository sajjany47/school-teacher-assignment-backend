import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../util.js";
import User from "./auth.model.js";
import { userSigninValidator, userSignUpValidator } from "./auth.validatior.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
  try {
    const validatedUser = await userSignUpValidator.validate(req.body);

    if (validatedUser) {
      const isValid = await User.findOne({
        email: validatedUser.email,
      });

      if (!isValid) {
        let userData = {
          _id: new mongoose.Types.ObjectId(),
          name: validatedUser.name,
          email: validatedUser.email,
          position: validatedUser.position,
          password: await bcrypt.hash(validatedUser.password, 10),
        };

        const createUser = new User(userData);

        const saveUser = await createUser.save();
        delete userData.password;

        return res
          .status(StatusCodes.OK)
          .json({ message: "User created successfully", data: userData });
      } else {
        return ErrorResponse(
          {
            message: "Email already exists",
            statusCode: StatusCodes.CONFLICT,
          },
          res
        );
      }
    }
  } catch (error) {
    ErrorResponse(error, res);
    // res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedUser = await userSigninValidator.validate(req.body);

    const user = await User.findOne({ email: validatedUser.email });
    if (!user) {
      return ErrorResponse(
        {
          message: "User not found!",
          statusCode: StatusCodes.NOT_FOUND,
        },
        res
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validatedUser.password,
      user.password
    );
    if (!isPasswordValid) {
      return ErrorResponse(
        {
          message: "Invalid password",
          statusCode: StatusCodes.UNAUTHORIZED,
        },
        res
      );
    }

    const userData = {
      _id: user._id,
      name: user.name,
      position: user.position,
      email: user.email,
    };

    const accessToken = jwt.sign(userData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(StatusCodes.OK)
      .json({
        message: "Login successful",
        data: {
          user: userData,
          accessToken: accessToken,
        },
      });
  } catch (error) {
    ErrorResponse(error, res);
  }
};
