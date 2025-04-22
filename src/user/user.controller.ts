import { Response, Request, NextFunction } from "express";
import { User } from "./user.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { isAdmin } from "../shared/middlewares/adminMiddleware.js";

const em = orm.em;

const jwtSecret = process.env.JWT_SECRET || "secret";
const isProduction = process.env.NODE_ENV === "production";
const sameSite = isProduction ? "none" : "lax";

export function sanitizeUserInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    isAdmin: req.body.isAdmin,
    username: req.body.username,
    password: req.body.password,
    names: req.body.names,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    mail: req.body.mail,
    phoneNumber: req.body.phoneNumber,
    itineraries: req.body.itineraries,
    opinions: req.body.opinions,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      User,
      {},
      { populate: ["itineraries.activities", "participants"] }
    );
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({ message: "Users found successfully", data: users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const user = await em.findOneOrFail(
      User,
      { _id: objectId },
      { populate: ["itineraries.activities", "participants"] }
    );
    return res
      .status(200)
      .json({ message: "User found successfully", data: user });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    req.body.sanitizedInput.isAdmin = false;
    const userCreated = em.create(User, req.body.sanitizedInput);
    const token = await createAccessToken({ id: userCreated.id });
    res.cookie("token", token, {
      httpOnly: isProduction,
      secure: isProduction,
      sameSite: sameSite,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    await em.flush();
    res
      .status(201)
      .json({ message: "User created successfully", data: userCreated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOneByPassword(req: Request, res: Response) {
  try {
    const password = req.params.password;
    const user = await em.findOneOrFail(User, { password: password });
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const user = em.getReference(User, req.params.id);
    const newUser = em.assign(user, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: "User updated successfully", data: newUser });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ message: "Username or email already exists" });
    }
    return res.status(500).send({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const user = em.getReference(User, objectId);
    await em.removeAndFlush(user);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}
