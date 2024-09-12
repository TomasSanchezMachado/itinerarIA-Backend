import { orm } from "../shared/db/orm.js";
import { ServicioExterno } from "./servicioExterno.entity.js";
const em = orm.em;
function sanitizeServicioExternoInput(req, res, next) {
    req.body.sanitizedInput = {
        tipoServicio: req.body.tipoServicio,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        horario: req.body.horario,
        sitioWeb: req.body.sitioWeb,
        telContacto: req.body.telContacto,
        lugar: req.body.lugar
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
        const servicioExterno = await em.find(ServicioExterno, {}, { populate: ['lugar'] });
        if (servicioExterno.length === 0) {
            return res.status(200).json({ message: 'No se encontraron servicios externos' });
        }
        res.status(200).json({ message: 'Todos los servicios externos encontrados', data: servicioExterno });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const servicioExterno = await em.findOneOrFail(ServicioExterno, { id });
        res.status(200).json({ message: 'Servicio externo encontrado', data: servicioExterno });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const servicioExterno = await em.findOneOrFail(ServicioExterno, { nombre: req.body.nombre });
        if (servicioExterno) {
            return res.status(409).json({ message: 'El servicio externo ya existe' });
        }
        const NewServicioExterno = em.create(ServicioExterno, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Servicio externo creado', data: NewServicioExterno });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const servicioExterno = em.getReference(ServicioExterno, id);
        em.assign(servicioExterno, req.body);
        await em.flush();
        res.status(200).json({ message: 'Servicio externo actualizado', data: servicioExterno });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const servicioExterno = em.getReference(ServicioExterno, id);
        em.removeAndFlush(servicioExterno);
        res.status(200).json({ message: 'Servicio externo eliminado', data: servicioExterno });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeServicioExternoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=servicioExterno.controller.js.map