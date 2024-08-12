import { Usuario } from "../usuario.entity.js";
import { orm } from "../../shared/db/orm.js";
import bcrypt from 'bcrypt';
import createAccessToken from "../../libs/jwt.js";
import { usuarioSchema } from "../../schemas/usuario.js";
import jwt from 'jsonwebtoken';
import { add } from "../usuario.controller.js";
const em = orm.em;
export function validateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No se proporciono un token,autorizacion denegada" });
    }
    try {
        const payload = jwt.verify(token, 'secret');
        req.body.payload = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token invalido" });
    }
}
export async function register(req, res) {
    try {
        console.log(req.body);
        const result = usuarioSchema.safeParse(req.body.sanitizedInput);
        if (!result.success) {
            return res.status(400).json({ message: "Datos inválidos", error: result.error.format() });
        }
        const { username, password } = req.body.sanitizedInput;
        const usuarioEncontrado = await em.findOneOrFail(Usuario, { username: username });
        if (!usuarioEncontrado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        else {
            const passwordHash = await bcrypt.hash(password, 10);
            req.hashedPassword = passwordHash;
            add(req, res);
        }
    }
    catch (err) {
        res.status(500).json({ message: "No se pudo crear el usuario", data: err });
    }
}
;
export async function login(req, res) {
    try {
        const usuario = await em.findOne(Usuario, { username: req.body.username });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        if (bcrypt.compareSync(req.body.password, usuario.password)) {
            const token = await createAccessToken({ username: usuario.username });
            res.cookie('token', token);
            return res.status(200).json({ message: "Usuario logueado", data: usuario });
        }
        else {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "No se pudo loguear el usuario", data: err });
    }
}
export async function logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: "Usuario deslogueado" });
}
export async function profile(req, res) {
    try {
        const usuario = await em.findOne(Usuario, { username: req.body.payload.username });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Perfil de usuario", data: { id: usuario._id, username: usuario.username, email: usuario.mail } });
    }
    catch (err) {
        res.status(500).json({ message: "No se pudo obtener el perfil del usuario", data: err });
    }
}
//# sourceMappingURL=auth.controller.js.map