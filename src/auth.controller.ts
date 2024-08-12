import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { orm } from "./shared/db/orm.js";
import { Usuario } from "./usuario/usuario.entity.js";
import add, { findOneByUserName } from "./usuario/usuario.controller.js";
import { Request, Response } from "express";
import { findOne } from "./lugar/lugar.controller.js";
import { createAccessToken } from "./libs/jwt.js";

interface RegisterRequest extends Request {
    hashedPassword?: string;
}

const em = orm.em;

export const register = async (req: RegisterRequest, res: Response) => {
    try {
        const { nombreDeUsuario, mail, password } = req.body;
        const usuarioEncontrado = await em.findOneOrFail(Usuario, { nombreDeUsuario: nombreDeUsuario })

        if (!usuarioEncontrado) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        else {
            const passwordHash = await bcrypt.hash(password, 10);
            req.hashedPassword = passwordHash;
            add(req, res);
        }
    } catch {
        return res.status(500).json({ message: "Error al registrar usuario" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { nombreDeUsuario, password } = req.body;
        const nombreUsuarioResponse = await findOneByUserName(req, res);

        if (nombreUsuarioResponse) {
            /* Faltaria agregar esto, ver donde va:
                res.cookie("token", token, {
                    httpOnly: process.env.NODE_ENV !== "development",
                    secure: true,
                    sameSite: "none",
                    });
    
                res.json({
                    id: userFound._id,
                    username: userFound.username,
                    email: userFound.email,});
            */
        }
        else {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
    } catch {
        return res.status(500).json({ message: "Error al registrar usuario" })
    }
}