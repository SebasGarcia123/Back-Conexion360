import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import authentication from '../middlewares/authentication'
import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'

const router = express.Router()

router.get('/me', authentication, getMe)
router.put('/me', authentication, updateMe)
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch("/:id/deactivate", deactivateUser)
router.patch("/users/:id/makeAdmin", authentication, makeUserAdmin)


async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().populate('role')
      res.send(users)
    } catch (err) {
      next(err)
    }
  }

async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    return
  }

  try {
    const user = await User.findById(req.params.id).populate('role')

    if (!user) {
      res.status(404).send('User not found')
      return
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}



async function updateUser(
  req: Request<{ id: string }, unknown, Partial<CreateUserRequest>>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }

  const isAdmin = req.isAdmin?.()
  const isSelf = req.user?._id === req.params.id

  // ❌ Usuario común editando a otro
  if (!isAdmin && !isSelf) {
    res.status(403).send('Unauthorized')
    return
  }

  // ❌ Usuario común intentando cambiar rol o estado
  if (!isAdmin) {
    delete req.body.role
    delete req.body.isActive
  }

  // ❌ Nadie puede cambiar su propio rol
  if (isSelf && req.body.role) {
    res.status(403).send('Cannot change your own role')
    return
  }

  // ❌ Nadie puede desactivarse a sí mismo
  if (isSelf && req.body.isActive === false) {
    res.status(403).send('Cannot deactivate yourself')
    return
  }

  // ❌ Email nunca editable
  delete req.body.email

  try {
    const userToUpdate = await User.findById(req.params.id)

    if (!userToUpdate) {
      res.status(404).send('User not found')
      return
    }

    // Validar rol si viene
    if (req.body.role) {
      const newRole = await Role.findById(req.body.role)

      if (!newRole) {
        res.status(400).send('Invalid role')
        return
      }

      req.body.role = newRole._id.toString()
    }

    // Encriptar password si viene
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    await userToUpdate.updateOne(req.body)
    res.send(userToUpdate)

  } catch (err) {
    next(err)
  }
}


async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    return
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).send('User not found')
      return
    }

    await User.deleteOne({ _id: user._id })

    res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

async function deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function makeUserAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params

    const adminRole = await Role.findOne({ name: "admin" })

    if(!adminRole){
  res.status(404).send({message: "No existe rol admin"})
  return
}

    const user = await User.findByIdAndUpdate(
      id,
      { role: adminRole._id },
      { new: true }
    )

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?._id

    if (!userId) {
      res.status(401).send('Unauthorized')
      return
    }

    const user = await User.findById(userId).populate('role')

    if (!user) {
      res.status(404).send('User not found')
      return
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function updateMe(
  req: Request<unknown, unknown, Partial<CreateUserRequest>>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'No hay datos para actualizar' })
    return
  }

  try {
    const userId = req.user?._id

    if (!userId) {
      res.status(401).send('Unauthorized')
      return
    }

    // No permitir cambiar email ni rol
    delete req.body.email
    delete req.body.role

    const userToUpdate = await User.findById(userId)

    if (!userToUpdate) {
      res.status(404).send('User not found')
      return
    }

    //  VALIDACIÓN NOMBRE DE USUARIO
    if (req.body.user) {
      const existingUser = await User.findOne({
        user: req.body.user,
        _id: { $ne: userId },
      })

      if (existingUser) {
        res.status(400).json({
          errors: [
            {
              path: 'user',
              msg: 'El nombre de usuario ya existe',
            },
          ],
        })
        return
      }
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    await userToUpdate.updateOne(req.body, { runValidators: true })

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}



export default router
