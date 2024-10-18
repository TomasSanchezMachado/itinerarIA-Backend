import { orm } from "../shared/db/orm.js";
import { Actividad } from "./actividad.entity.js";
const em = orm.em;
function sanitizeActividadInput(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        description: req.body.description,
        outdoor: req.body.outdoor,
        transport: req.body.transport,
        schedule: req.body.schedule,
        place: req.body.place,
        itinerary: req.body.itinerary,
        opinions: req.body.opinions
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const actividad = await em.find(Actividad, {}, { populate: ['place', 'itinerary', 'opinions'] });
        if (actividad.length === 0) {
            return res.status(200).json({ message: 'No se encontraron actividades' });
        }
        res.status(200).json({ message: 'Todos las actividades encontrados', data: actividad });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const actividad = await em.findOneOrFail(Actividad, { id });
        res.status(200).json({ message: 'Actividad encontrada', data: actividad });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        //Validacion que la actividad no exista
        console.log(req.body.place);
        const actividadExistente = await em.findOne(Actividad, { name: req.body.name, place: req.body.place, itinerary: req.body.itinerary });
        if (actividadExistente) {
            return res.status(400).json({ message: ['Actividad ya existente'] });
        }
        const actividad = em.create(Actividad, { ...req.body.sanitizedInput, place: req.body.place.id });
        await em.flush();
        res.status(201).json({ message: 'Actvidad creada', data: actividad });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const actividadExistente = await em.findOne(Actividad, { name: req.body.name, place: req.body.place, itinerary: req.body.itinerary });
        if (actividadExistente && actividadExistente.id !== id) {
            return res.status(400).json({ message: ['Actividad ya existente'] });
        }
        const actividad = em.getReference(Actividad, id);
        em.assign(actividad, { ...req.body.sanitizedInput, place: req.body.place.id });
        await em.flush();
        res.status(200).json({ message: 'Actividad actualizada', data: actividad, itinerary: req.body.itinerary });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const actividad = em.getReference(Actividad, id);
        em.removeAndFlush(actividad);
        res.status(200).json({ message: 'Actividad eliminada', data: actividad });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeActividadInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=actividad.controller.js.map