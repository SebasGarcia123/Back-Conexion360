import express, { Request, Response, NextFunction } from 'express'
import User from '../schemas/user'
import { loginRequest } from '../types/index'
import jwt, { SignOptions } from 'jsonwebtoken'
import type { StringValue } from 'ms'


const router = express.Router()

const signOptions: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN ?? '2h') as StringValue,
  issuer: 'base-api-express-generator',
}

// Clave secreta para JWT (en producción usar process.env.JWT_SECRET)
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET no está definido')
  }
  return secret
}

// const JWT_EXPIRES_IN = '2h' // tiempo de expiración del token

router.post('/', loginUser)


async function loginUser(
  req: Request<Record<string, never>, unknown, loginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {

  const { user, password } = req.body  

  try {
    // Buscar usuario por campo 'user'
    const foundUser = await User.findOne({ user }).select('+password').populate('role')

    if (!foundUser) {
      res.status(404).json({ message: 'Usuario no existe' })
      return
    }

    // Verificar contraseña
    const { isOk, isLocked } = await foundUser.checkPassword(password)

    if (!isOk) {
      res.status(401).json({ message: 'Contraseña incorrecta' })
      return
    }

    if (isLocked) {
      res.status(403).json({ message: 'Usuario inactivo' })
      return
    }
    
    // Preparar payload del JWT
    const payload = {
      _id: foundUser._id.toString(),
      usuario: foundUser.user,
      role:
        typeof foundUser.role === 'object' && 'name' in foundUser.role
          ? foundUser.role.name
          : foundUser.role.toString(),
    }

    // Usuario inactivo
    if (!foundUser.isActive) {
      res.status(403).json({
        message: 'Usuario inactivo',
      })
      return
    }


    // Generar token JWT
    const token = jwt.sign(payload, getJwtSecret(), signOptions)


    // Enviar token y algunos datos básicos del usuario
    res.status(200).json({
      token,
      user: {
        _id: foundUser._id,
        usuario: foundUser.user,
        role: payload.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

export default router



