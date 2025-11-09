import express, { Request, Response, NextFunction } from 'express'
import User from '../schemas/user'

const router = express.Router()

router.get('/', getAllUsers)

  async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('getAllUsers by user ', req.user?._id)
    try {
      const users = await User.find({ isActive: true }).populate('role')
      res.send(users)
    } catch (err) {
      next(err)
    }
  }

  export default router