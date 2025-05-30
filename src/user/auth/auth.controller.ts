import { Response, Request, NextFunction } from "express";
import { User } from "../user.entity.js";
import { orm } from "../../shared/db/orm.js";
import bcrypt from "bcryptjs";
import createAccessToken from "../../libs/jwt.js";
import { registerSchema } from "../../schemas/auth.js";
import jwt from "jsonwebtoken";
import { add } from "../user.controller.js";

const em = orm.em;

const isProduction = process.env.NODE_ENV === "production";
const sameSite = isProduction ? "none" : "lax";

const jwtSecret = process.env.JWT_SECRET || "secret";

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Auth token is not supplied" });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.body.payload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

interface RegisterRequest extends Request {
  hashedPassword?: string;
}

export async function register(req: RegisterRequest, res: Response) {
  try {
    const { username, password } = req.body.sanitizedInput;
    //Valido que el username no exista
    const user = await em.findOne(User, { username });
    if (user) {
      return res.status(400).json({ message: ["User already exists"] });
    }

    const mail = await em.findOne(User, { mail: req.body.sanitizedInput.mail });
    if (mail) {
      return res.status(400).json({ message: ["The email is already in use"] });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    req.body.sanitizedInput.password = passwordHash;
    add(req, res);
  } catch (err: any) {
    res.status(500).json({
      message: "The user could not be registered",
      data: { message: "User already exists" },
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await em.findOne(
      User,
      { username: req.body.username },
      {
        populate: [
          "itineraries.activities",
          "participants",
          "itineraries.place",
        ],
      }
    );
    if (!user) {
      return res.status(400).json({
        message: ["Incorrect username or password. Please try again."],
      });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = await createAccessToken({ id: user.id });
      res.cookie("token", token, {
        httpOnly: isProduction,
        secure: isProduction,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return res
        .status(200)
        .json({ message: "User logged successfully", data: { user }, token });
    } else {
      return res.status(400).json({
        message: ["Incorrect username or password. Please try again."],
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user could not be logged in", data: err });
  }
}

export async function logout(req: Request, res: Response) {
  try{
    res.clearCookie("token", {
      httpOnly: isProduction,
      secure: isProduction,
      sameSite: sameSite,
    });
    res.status(200).json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error during logout" });
  }
}

export async function profile(req: Request, res: Response) {
  try {
    const user = await em.findOne(User, {
      username: req.body.payload.username,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User profile found",
      data: { user },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user profile could not be found", data: err });
  }
}
export async function verify(req: Request, res: Response) {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, jwtSecret, async (err: any, user: any) => {
    if (err) return res.sendStatus(401);
    const userFound = await em.findOne(
      User,
      { id: user.id },
      { populate: ["itineraries.activities", "participants"] }
    );
    if (!userFound)
      return res
        .status(401)
        .json({ message: "User not found", userFound: userFound });
    return res
      .status(200)
      .json({ message: "User found", data: { user: userFound } });
  });
}
