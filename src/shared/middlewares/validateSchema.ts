import { Response, Request, NextFunction } from "express"
export const validateSchema = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body.sanitizedInput);
        next();
    } catch (error) {
        return res.status(400).json({ message: (error as any).errors.map((error: any) => error.message) });

    }
}