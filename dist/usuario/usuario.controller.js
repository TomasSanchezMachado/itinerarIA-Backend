import { Usuario } from "./usuario.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import createAccessToken from "../libs/jwt.js";
const em = orm.em;
export function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        username: req.body.username,
        password: req.body.password,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        mail: req.body.mail,
        nroTelefono: req.body.nroTelefono,
        itinerarios: req.body.itinerarios,
        opiniones: req.body.opiniones,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    try {
        const usuarios = await em.find(Usuario, {}, { populate: ["itinerarios.actividades"] });
        res.header("Access-Control-Allow-Origin", "*");
        res
            .status(200)
            .json({ message: "Usuarios encontrados exitosamente:", data: usuarios });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = await em.findOneOrFail(Usuario, { _id: objectId }, { populate: ["itinerarios.actividades"] });
        return res
            .status(200)
            .json({ message: "Usuario encontrado exitosamente", data: usuario });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        const usuario = em.create(Usuario, req.body.sanitizedInput);
        await em.flush();
        const token = await createAccessToken({ username: usuario.username });
        res.cookie('token', token);
        res.status(201).json({ message: "Usuario creado correctamente", usuario: { id: usuario._id, username: usuario.username } });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOneByPassword(req, res) {
    try {
        const password = req.params.password;
        const usuario = await em.findOneOrFail(Usuario, { password: password });
        return res.json(usuario);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export default add;
export async function update(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = em.findOneOrFail(Usuario, objectId);
        em.assign(usuario, req.body);
        await em.flush();
        res
            .status(200)
            .json({ message: "usuario actualizado correctamente", data: usuario });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
export async function remove(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = em.getReference(Usuario, objectId);
        await em.removeAndFlush(usuario);
        res.status(200).send({ message: "usuario eliminado correctamente" });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
//# sourceMappingURL=usuario.controller.js.map