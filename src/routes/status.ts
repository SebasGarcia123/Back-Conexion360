import express, { Request, Response } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Read package.json without experimental import
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.send({ name: pkg.name, version: pkg.version, enviroment: process.env.ENV })
})

router.get('/status', (req: Request, res: Response) => {
  console.log('Responding to status request')
  res.status(200).send({ status: 'The API is up and running' })
})

export default router
