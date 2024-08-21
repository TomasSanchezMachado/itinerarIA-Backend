import { z } from 'zod';
const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const horarioSchema = z.string().regex(horarioRegex, 'Formato de horario inválido');
const sitioWebRegex = /^(http|https):\/\/[^ "]+$/;
const sitioWebSchema = z.string().regex(sitioWebRegex, 'Formato de sitio web inválido');
const telRegex = /^\d{10}$/;
const telSchema = z.string().regex(telRegex, 'Formato de teléfono inválido');
export const putSchema = z.object({
    tipoServicio: z.string({
        invalid_type_error: 'El tipo de servicio debe ser un string',
        required_error: 'El tipo de servicio es requerido',
    }).min(3, 'El tipo de servicio debe tener al menos 3 caracteres'),
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido',
    }).min(3, 'El nombre debe tener al menos 3 caracteres'),
    descripcion: z.string({
        invalid_type_error: 'La descripción debe ser un string',
        required_error: 'La descripción es requerida',
    }).min(3, 'La descripción debe tener al menos 3 caracteres'),
    direccion: z.string({
        invalid_type_error: 'La dirección debe ser un string',
        required_error: 'La dirección es requerida',
    }).min(3, 'La dirección debe tener al menos 3 caracteres'),
    horario: horarioSchema.optional(),
    sitioWeb: sitioWebSchema.optional(),
    telContacto: telSchema.optional(),
});
export const patchSchema = z.object({
    tipoServicio: z.string({
        invalid_type_error: 'El tipo de servicio debe ser un string',
    }).min(3, 'El tipo de servicio debe tener al menos 3 caracteres').optional(),
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
    }).min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    descripcion: z.string({
        invalid_type_error: 'La descripción debe ser un string',
    }).min(3, 'La descripción debe tener al menos 3 caracteres').optional(),
    direccion: z.string({
        invalid_type_error: 'La dirección debe ser un string',
    }).min(3, 'La dirección debe tener al menos 3 caracteres').optional(),
    horario: horarioSchema.optional(),
    sitioWeb: sitioWebSchema.optional(),
    telContacto: telSchema.optional(),
});
//# sourceMappingURL=servicioExterno.js.map