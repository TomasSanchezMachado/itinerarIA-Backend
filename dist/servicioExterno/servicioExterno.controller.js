import { orm } from "../shared/db/orm.js";
import { ServicioExterno } from "./servicioExterno.entity.js";
const em = orm.em;
async function findAll(req, res) {
    try {
        const servicioExterno = await em.find(ServicioExterno, {});
        res.status(200).json({ message: 'Todos los servicios externos encontrados', data: servicioExterno });
    }
    catch (error) {
        res.status(404).json({ message: 'No se encontraron servicios externos', error: error });
    }
}
//# sourceMappingURL=servicioExterno.controller.js.map