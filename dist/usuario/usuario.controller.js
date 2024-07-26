import { Usuario } from "./usuario.entity.js";
import { orm } from '../shared/db/orm.js';
import { ObjectId } from "@mikro-orm/mongodb";
const em = orm.em;
export async function findAll(req, res) {
    try {
        const usuarios = await em.find(Usuario, {}, { populate: ['itinerarios.actividades'] });
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: "Usuarios encontrados exitosamente:", data: usuarios });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = await em.findOneOrFail(Usuario, { _id: objectId }, { populate: ['itinerarios.actividades'] });
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
        const usuario = em.create(Usuario, req.body);
        await em.flush();
        res.status(201).json({ message: "usuario creado correctamente", data: usuario });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
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
        res
            .status(200)
            .send({ message: "usuario eliminado correctamente" });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
//# sourceMappingURL=usuario.controller.js.map