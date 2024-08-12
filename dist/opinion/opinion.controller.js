import { orm } from "../shared/db/orm.js";
import { Opinion } from "./opinion.entity.js";
const em = orm.em;
function sanitizeOpinionInput(req, res, next) {
    req.body.sanitizedInput = {
        calificacion: req.body.calificacion,
        comentario: req.body.comentario,
        usuario: req.body.usuario,
        actividad: req.body.actividad,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const opinion = await em.find(Opinion, {}, { populate: ["usuario", "actividad"] });
        if (opinion.length === 0) {
            return res.status(200).json({ message: "No se encontraron opiniones" });
        }
        res
            .status(200)
            .json({ message: "Todos las opiniones encontradas", data: opinion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const opinion = await em.findOneOrFail(Opinion, { id });
        res.status(200).json({ message: "Opinion encontrada: ", data: opinion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const opinion = em.create(Opinion, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "Opinion creada", data: opinion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const opinion = await em.findOneOrFail(Opinion, { id });
        Object.assign(opinion, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: "Opinion actualizada", data: opinion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const opinion = em.getReference(Opinion, id);
        em.removeAndFlush(opinion);
        res.status(200).json({ message: "Opinion eliminada" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeOpinionInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=opinion.controller.js.map