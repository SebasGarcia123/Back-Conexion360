import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'
import { validationResult } from 'express-validator'  


const router = express.Router()

router.post('/', createUser)

async function createUser(
  req: Request<Record<string, never>, unknown, CreateUserRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('createUser: ', req.body)

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
  } catch (err) {
    next(err)
    res.status(500).send("Error interno del servidor")
  }
}

export default router