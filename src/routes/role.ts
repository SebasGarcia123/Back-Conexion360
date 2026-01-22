import express, { Request, Response } from 'express'
import Role from '../schemas/role'
import authentication from '../middlewares/authentication'

const router = express.Router()

router.get('/', authentication, getRoles)

export default router

async function getRoles(req: Request, res: Response) {
  try {
    const roles = await Role.find({ isActive: true }).select('_id name').lean()
    res.json(roles)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los roles' })
  }
}
