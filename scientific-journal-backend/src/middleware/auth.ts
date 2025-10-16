import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/authorization/RefreshToken';
import { User } from '../models/authorization/User';
import { Role } from '../models/authorization/Role';
import { ResourceRole } from '../models/authorization/ResourceRole.';
import { Resource } from '../models/authorization/Resource';
import { RoleUser } from '../models/authorization/RoleUser';
import { pathToRegexp } from 'path-to-regexp'; // Importar path-to-regexp

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const refresh_token = req.header('x-reset-token');
  const currentRoute = req.originalUrl;
  const currentMethod = req.method;

  console.log(currentRoute)
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado: No se proporcionó el token principal.' });
    return;
  }

  try {
    // Verificar si el token principal es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;

    // Buscar el usuario en la base de datos
    const user: User | null = await User.findOne({ where: { id: decoded.id, is_active: true } });
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado o inactivo.' });
      return;
    }

    // Obtener el último registro de refresh_token para este usuario
    const lastRefreshToken = await RefreshToken.findOne({
      where: { user_id: user.id },
      order: [['created_at', 'DESC']], // Ordenar por fecha de creación descendente
    });

    if (!lastRefreshToken) {
      res.status(401).json({ error: 'No se encontró un refresh token válido.' });
      return;
    }

    // Verificar si el último refresh_token ha expirado
    if (lastRefreshToken.expires_at < new Date()) {
      // El refresh_token ha expirado, generar uno nuevo
      const { token: newRefreshToken, expiresAt } = user.generateRefreshToken();

      // Crear un nuevo registro en la tabla refresh_tokens
      await RefreshToken.create({
        user_id: user.id,
        token: newRefreshToken,
        device_info: req.headers['user-agent'] || 'unknown',
        is_valid: 'ACTIVE',
        expires_at: expiresAt,
      });

      // Invalidar el refresh_token anterior
      await lastRefreshToken.update({ is_valid: 'INACTIVE' });

      // Enviar el nuevo refresh_token en el encabezado
      res.setHeader('x-reset-token', newRefreshToken);
    
    }

    // Validar autorización
    const isAuthorized = await validateAuthorization(decoded.id, currentRoute, currentMethod);
    if (!isAuthorized) {
      res.status(403).json({ error: 'No está autorizado para ejecutar esta petición.' });
      return;
    }

    // Continuar con la solicitud
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'El token principal ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Token inválido.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
    }
  }
};



export const validateAuthorization = async (userId: number, resourcePath: string, resourceMethod: string): Promise<boolean> => {
  try {
    // Obtener todos los recursos activos que coincidan con el método
    const resources = await Resource.findAll({
      where: { method: resourceMethod, is_active: "ACTIVE" },
    });

    // Convertir las rutas dinámicas a expresiones regulares y buscar coincidencias
    const matchingResource = resources.find((resource) => {
      const regex = pathToRegexp(resource.path).regexp.test(resourcePath);
      return regex;
    });

    if (!matchingResource) {
      return false; // No hay coincidencias para la ruta y el método
    }

    // Verificar si existe una relación válida entre el usuario, su rol y el recurso solicitado
    const resourceRole = await ResourceRole.findOne({
      include: [
        {
          model: Role,
          include: [
            {
              model: RoleUser,
              where: { user_id: userId, is_active: "ACTIVE" }, // Validar que el usuario esté asociado al rol
            },
          ],
          where: { is_active: "ACTIVE" }, // Validar que el rol esté activo
        },
      ],
      where: { resource_id: matchingResource.id, is_active: "ACTIVE" }, // Validar que la relación resource_role esté activa
    });

    return !!resourceRole; // Retorna true si se encuentra un registro coincidente
  } catch (error) {
    console.error('Error al validar la autorización:', error);
    return false;
  }
};