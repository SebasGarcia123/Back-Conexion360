import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import authentication from '../middlewares/authentication'
import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch("/users/:id/deactivate", authentication, deactivateUser)
router.patch("/users/:id/makeAdmin", authentication, makeUserAdmin)

// function toDate(input: string): Date {
//   const parts = input.split('/')
//   if (parts.length !== 3) {
//     throw new Error('Invalid date format. Expected DD/MM/YYYY')
//   }
//   const [day, month, year] = parts
//   if (!day || !month || !year) {
//     throw new Error('Invalid date format. Expected DD/MM/YYYY')
//   }
//   return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
// }

  async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('getAllUsers by user ', req.user?._id)
    try {
      const users = await User.find({ isActive: true }).populate('role')
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
  console.log('getUser with id: ', req.params.id)

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
  console.log('updateUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    return
  }

  if (!req.isAdmin?.() && req.params.id !== req.user?._id) {
    res.status(403).send('Unauthorized')
    return
  }

  // The email can't be updated
  delete req.body.email

  try {
    const userToUpdate = await User.findById(req.params.id)

    if (!userToUpdate) {
      console.error('User not found')
      res.status(404).send('User not found')
      return
    }

    if (req.body.role) {
      const newRole = await Role.findById(req.body.role)

      if (!newRole) {
        console.info('New role not found. Sending 400 to client')
        res.status(400).end()
        return
      }
      req.body.role = newRole._id.toString()
    }

    if (req.body.password) {
      const passEncrypted = await bcrypt.hash(req.body.password, 10)
      req.body.password = passEncrypted
    }

    // This will return the previous status
    await userToUpdate.updateOne(req.body)
    res.send(userToUpdate)

    // This return the current status
    // userToUpdate.password = req.body.password
    // userToUpdate.role = req.body.role
    // userToUpdate.firstName = req.body.firstName
    // userToUpdate.lastName = req.body.lastName
    // userToUpdate.phone = req.body.phone
    // userToUpdate.bornDate = req.body.bornDate
    // userToUpdate.isActive = req.body.isActive
    // await userToUpdate.save()
    // res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('deleteUser with id: ', req.params.id)

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

export default router
