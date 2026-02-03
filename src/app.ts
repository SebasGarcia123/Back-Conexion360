import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'

import statusRouter from './routes/status'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import loginRouter from './routes/login'
import adminRouter from './routes/admin'
import clientRouter from './routes/client'
import buildingRouter from './routes/building'
import spaceRouter from './routes/space'
import registerRouter from './routes/register'
import reservationRouter from './routes/reservations'
import buildingHomeRouter from './routes/buildingHome'
import authentication from './middlewares/authentication'
import validateRegister from './middlewares/validationRegister'
import opinionRouter from './routes/opinion'
import roleRouter from './routes/role'
import authorization from './middlewares/authorization'
import indicadoresRoutes from './routes/indicadores'

const app = express()
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('__dirname:', __dirname)


app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', statusRouter)
app.use('/auth', authRouter)
app.use('/register', validateRegister, registerRouter)
app.use('/login', loginRouter)
app.use('/users', authentication, authorization, userRouter)
app.use('/buildings', authentication, authorization, buildingRouter)
app.use('/spaces', authentication, authorization, spaceRouter)
app.use('/reservations', authentication, authorization, reservationRouter)
app.use('/client', authentication, authorization, clientRouter)
app.use('/admin', authentication, authorization, adminRouter)
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use('/buildingHome', buildingHomeRouter)
app.use('/opinions', opinionRouter)
app.use('/roles', roleRouter)
app.use('/indicadores', authentication, authorization,indicadoresRoutes)


export default app
