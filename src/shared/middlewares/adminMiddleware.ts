import { Request, Response, NextFunction } from 'express';
import { orm } from '../db/orm.js';
import jwt from 'jsonwebtoken';
import { User } from '../../user/user.entity.js';

const em = orm.em;
const secretKey = process.env.JWT_SECRET || 'secret';

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  // Verifica si el token es válido
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  // Obtengo el id del usuario contenido en la cookie
  jwt.verify(token, secretKey, async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.id;
    const user = await em.findOne(User, { id: userId.toString() });
    

    // Si el usuario existe y es administrador, pasa al siguiente middleware
    if (user && user.isAdmin) {
      return next();
    }

    // Si el usuario no tiene privilegios de administrador, responde con un error 403
    return res.status(403).json({ message: "You are not authorized to access this resource" });
  });
};
