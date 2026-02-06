import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'
import { validationResult } from 'express-validator'
import validationRegisters from '../middlewares/validationRegister'; 


const router = express.Router()

router.post('/', validationRegisters, createUser)

async function createUser(
  req: Request<Record<string, never>, unknown, CreateUserRequest>,
  res: Response,
): Promise<void> {
  // Validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

  const user = req.body

  try {
    const resultValidation = validationResult(req)

    if(!resultValidation.isEmpty()){
      res.status(400).json({errors: resultValidation.array()})
      return
    }

    const role = await Role.findOne({ name: user.role })
    if (!role) {
      res.status(404).send('Role not found')
      return
    }

    const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await User.create({
      ...user,
      password: passEncrypted,
      role: role._id,
    })
    res.status(201).send(userCreated)
  } catch (err: any) {
  // Error de clave duplicada (email o user)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]

    res.status(409).json({
      errors: [
        {
          path: field,
          msg: `El ${field} ya está registrado`
        }
      ]
    })
    return
  }

  console.error(err)
  res.status(500).json({
    message: 'Error interno del servidor'
  })
}

}

export default router