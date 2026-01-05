import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../schemas/user'
import { loginRequest } from '../types/index'

const router = express.Router()

// Clave secreta para JWT (en producción usar process.env.JWT_SECRET)
const JWT_SECRET = 'base-api-express-generator'
const JWT_EXPIRES_IN = '2h' // tiempo de expiración del token

router.post('/', loginUser)


async function loginUser(
  req: Request<Record<string, never>, unknown, loginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {

  const { user, password } = req.body
  console.log("body completo recibido: ", req.body)
  console.log("user:", user)
  console.log("password:", password)
  

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
      res.status(403).json({ message: 'Usuario bloqueado' })
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

    // Generar token JWT
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'base-api-express-generator',
    })

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



