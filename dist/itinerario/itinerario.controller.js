import { ItinerarioRepository } from "./itinerario.repository.js";
import { Itinerario } from "./itinerario.entity.js";
const repository = new ItinerarioRepository();
export function sanitizeItinerarioInput(req, res, next) {
    req.body.sanitizedInput = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        cantDias: req.body.cantDias,
        actividades: req.body.actividades,
        transporte: req.body.transporte
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    const itinerarios = await repository.findAll();
    if (!itinerarios) {
        return res.status(404).send({ data: 'No se encontraron itinerarios' });
    }
    res.status(200).json({ data: itinerarios });
}
export async function findOne(req, res) {
    const itinerario = await repository.findOne({ id: req.params.id });
    if (!itinerario) {
        return res.status(404).send({ message: "Itinerario no encontrado" });
    }
    res.json({ data: itinerario });
}
export async function add(req, res) {
    const input = req.body.sanitizedInput;
    const itinerarioInput = new Itinerario(input.titulo, input.descripcion, input.cantDias, input.actividades, input.transporte);
    const itinerario = await repository.add(itinerarioInput);
    return res
        .status(201)
        .send({ message: "Itinerario cargado correctamente", data: itinerario });
}
export async function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const result = (req.body.sanitizedInput);
    const itinerario = await repository.update(req.body.sanitizedInput);
    if (!itinerario) {
        return res.status(404).send({ message: "Itinerario no encontrado" });
    }
    res.status(200).send({
        message: "Itinerario actualizado correctamente",
        data: itinerario,
    });
}
export async function remove(req, res) {
    const itinerario = await repository.delete({ id: req.params.id });
    if (!itinerario) {
        return res.status(404).send({ message: "Itinerario no encontrado" });
    }
    return res.status(200).json({ message: "Itinerario eliminado correctamente", data: itinerario });
}
//# sourceMappingURL=itinerario.controller.js.map