import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'secret';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token; // Accedemos al token desde las cookies
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificamos el token
  jwt.verify(token, secretKey, (err: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    // Si el token es válido, simplemente pasamos al siguiente middleware o ruta
    next();
  });
}
