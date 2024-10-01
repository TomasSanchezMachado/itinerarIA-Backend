import { Response, Request, NextFunction } from "express";
import { Usuario } from "../usuario.entity.js";
import { orm } from "../../shared/db/orm.js";
import bcrypt from "bcrypt";
import createAccessToken from "../../libs/jwt.js";
import { registerSchema } from "../../schemas/auth.js";
import jwt from "jsonwebtoken";
import { add } from "../usuario.controller.js";

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
    const usuario = await em.findOne(Usuario, { username });
    if (usuario) {
      return res.status(400).json({ message: ["Usuario ya existe"] });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    req.body.sanitizedInput.password = passwordHash;
    add(req, res);
  } catch (err) {
    res.status(500).json({ message: "No se pudo crear el usuario", data: err });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const usuario = await em.findOne(Usuario, { username: req.body.username },
      { populate: ["itineraries.activities"] });
    if (!usuario) {
      return res.status(400).json({ message: ["Usuario no encontrado"] });//Deberia decir datos incorrectos nomas
    }
    if (bcrypt.compareSync(req.body.password, usuario.password)) {
      const token = await createAccessToken({ username: usuario.username });
      res.cookie("token", token);
      console.log(usuario);
      return res
        .status(200)
        .json({ message: "Usuario logueado", data: { usuario } });
    } else {
      return res.status(400).json({ message: ["Contraseña incorrecta"] });//Deberia decir datos incorrectos nomas
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "No se pudo loguear el usuario", data: err });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.status(200).json({ message: "Usuario deslogueado" });
}

export async function profile(req: Request, res: Response) {
  try {
    const usuario = await em.findOne(Usuario, {
      username: req.body.payload.username,
    });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({
      message: "Perfil de usuario",
      data: {
        id: usuario._id,
        username: usuario.username,
        mail: usuario.mail,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "No se pudo obtener el perfil del usuario", data: err });
  }
}
export async function verify(req:Request,res:Response){
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, 'secret', async (err: any, user: any) => {
    if (err) return res.sendStatus(401);
    console.log('llegue');
    const userFound = await em.findOne(Usuario,{ username: user.username }, { populate: ["itineraries.activities"] });
    if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" });

    return res
        .status(200)
        .json({ message: "Usuario logueado", data: { usuario: userFound } });
  });
};