import { Response, Request, NextFunction } from "express";
import { User } from "../user.entity.js";
import { orm } from "../../shared/db/orm.js";
import bcrypt from "bcrypt";
import createAccessToken from "../../libs/jwt.js";
import { registerSchema } from "../../schemas/auth.js";
import jwt from "jsonwebtoken";
import { add } from "../user.controller.js";

const em = orm.em;



export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporciono un token,autorizacion denegada" });
  }
  try {
    const payload = jwt.verify(token, "secret");
    req.body.payload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalido" });
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
      return res.status(400).json({ message: ["User ya existe"] });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    req.body.sanitizedInput.password = passwordHash;
    add(req, res);
  } catch (err) {
    res.status(500).json({ message: "No se pudo crear el user", data: err });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await em.findOne(User, { username: req.body.username },
      { populate: ["itineraries.activities", "participants", "itineraries.place"] });
    if (!user) {
      return res.status(400).json({ message: ["User no encontrado"] });//Deberia decir datos incorrectos nomas
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = await createAccessToken({ username: user.username });
      res.cookie("token", token);
      console.log(user);
      return res
        .status(200)
        .json({ message: "User logueado", data: { user } });
    } else {
      return res.status(400).json({ message: ["Contraseña incorrecta"] });//Deberia decir datos incorrectos nomas
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "No se pudo loguear el user", data: err });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.status(200).json({ message: "User deslogueado" });
}

export async function profile(req: Request, res: Response) {
  try {
    const user = await em.findOne(User, {
      username: req.body.payload.username,
    });
    if (!user) {
      return res.status(400).json({ message: "User no encontrado" });
    }
    res.status(200).json({
      message: "Perfil de user",
      data: {
        id: user._id,
        username: user.username,
        mail: user.mail,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "No se pudo obtener el perfil del user", data: err });
  }
}
export async function verify(req:Request,res:Response){
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, 'secret', async (err: any, user: any) => {
    if (err) return res.sendStatus(401);
    const userFound = await em.findOne(User,{ username: user.username }, { populate: ["itineraries.activities", "participants"] });
    if (!userFound) return res.status(401).json({ message: "User no encontrado" });

    return res
        .status(200)
        .json({ message: "User logueado", data: { user: userFound } });
  });
};