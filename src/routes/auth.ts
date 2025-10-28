import { Router, Request, Response, NextFunction } from 'express'
import User from '../schemas/user'
import generateUserToken from '../utils/generate-user-and-token'
import { LoginRequest } from '../types/index'

const router = Router()

router.post('/', createUserToken)

async function createUserToken(
  req: Request<Record<string, never>, unknown, LoginRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log(`Creating user token for ${req.body.email}`)

  if (!req.body.email) {
    console.error('Missing email parameter. Sending 400 to client')
    res.status(400).end()
    return
  }

  if (!req.body.password) {
    console.error('Missing password parameter. Sending 400 to client')
    res.status(400).end()
    return
  }

  try {
    const user = await User.findOne({ email: req.body.email }, '+password')

    if (!user) {
      console.error('User not found. Sending 404 to client')
      res.status(401).end()
      return
    }

    console.log('Checking user password')
    const result = await user.checkPassword(req.body.password)

    if (result.isLocked) {
      console.error('User is locked. Sending 400 (Locked) to client')
      res.status(400).end()
      return
    }

    if (!result.isOk) {
      console.error('User password is invalid. Sending 401 to client')
      res.status(401).end()
      return
    }

    const response = await generateUserToken(req, user)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export default router
