import z from 'zod';
export const itinerarioSchema = z.object({
    titulo: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El titulo es requerido'
    }).min(3, 'El titulo debe tener como minimo 3 caracteres').max(20),
    descripcion: z.string({
        invalid_type_error: 'La descripción debe ser un string',
        required_error: 'La descripción es requerida'
    }).min(10, 'La descripcion debe tener como minimo 10 caracteres').max(100),
    cantDias: z.number({
        invalid_type_error: 'La duración debe ser un número',
        required_error: 'La duración es requerida'
    }).min(1, 'El itinerario debe durar como minimo 1 día').max(14, 'El itinerario no puede durar más de 14 días'),
});
export const patchItinerarioSchema = z.object({
    titulo: z.string({
        invalid_type_error: 'El nombre debe ser un string'
    }).min(3, 'El titulo debe tener como minimo 3 caracteres').max(20).optional(),
    descripcion: z.string({
        invalid_type_error: 'La descripción debe ser un string'
    }).min(10, 'La descripcion debe tener como minimo 10 caracteres').max(100).optional(),
    cantDias: z.number({
        invalid_type_error: 'La duración debe ser un número'
    }).min(1, 'El itinerario debe durar como minimo 1 dia`').max(30, 'El itinerario no puede durar más de 30 días').optional(),
});
//# sourceMappingURL=itinerario.js.map