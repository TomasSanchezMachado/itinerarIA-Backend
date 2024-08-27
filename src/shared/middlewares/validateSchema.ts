import { Response, Request, NextFunction } from "express"
import { z } from "zod"

// Función de validación de esquema
export const validateSchema = (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body.sanitizedInput); // Ajusta según dónde están tus datos en el cuerpo de la solicitud
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorObject: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    errorObject[err.path[0]] = err.message;
                }
            });
            return res.status(400).json({ errors: errorObject });
        }
        // En caso de error inesperado
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};