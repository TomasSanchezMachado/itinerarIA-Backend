import { z } from 'zod';
const UbicacionValidator = z.object({
    latitud: z.number({
        invalid_type_error: 'La latitud debe ser un número',
        required_error: 'La latitud es requerida',
    }),
    longitud: z.number({
        invalid_type_error: 'La longitud debe ser un número',
        required_error: 'La longitud es requerida',
    }),
});
const lugarSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido',
    }).min(1),
    ubicacion: UbicacionValidator,
    codigoPostal: z.string({
        invalid_type_error: 'El código postal debe ser un string',
        required_error: 'El código postal es requerido',
    }).min(1),
    provincia: z.string({
        invalid_type_error: 'La provincia debe ser un string',
        required_error: 'La provincia es requerida',
    }).min(1),
    pais: z.string({
        invalid_type_error: 'El país debe ser un string',
        required_error: 'El país es requerido',
    }).min(1),
});
export function validateLugar(object) {
    return lugarSchema.safeParse(object);
}
export function validatePartialLugar(object) {
    return lugarSchema.partial().safeParse(object);
}
//# sourceMappingURL=lugar.js.map