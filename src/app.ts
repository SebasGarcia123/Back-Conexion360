import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";

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
import buildingHome from './routes/buildingHome'
import authentication from './middlewares/authentication'
import validateRegister from './middlewares/validationRegister'
//import authorization from './middlewares/authorization'

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//app.use(authorization)

app.use('/', statusRouter)
app.use('/auth', authRouter)
app.use('/register', validateRegister, registerRouter)
app.use('/login', loginRouter)
app.use('/users', authentication, userRouter)
app.use('/buildings', authentication, buildingRouter)
app.use('/spaces', authentication, spaceRouter)
app.use('/reservations', authentication, reservationRouter)
app.use('/client', authentication, clientRouter)
app.use('/admin', authentication, adminRouter)
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use('/buildingHome', buildingHome)

export default app
