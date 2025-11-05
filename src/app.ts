import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import statusRouter from './routes/status'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import loginRouter from './routes/login'
import buildingRouter from './routes/building'
import spaceRouter from './routes/space'
import registerRouter from './routes/register'
import reservationRouter from './routes/reservations'
import authentication from './middlewares/authentication'
import validateRegister from './middlewares/validateRegister'
//import authorization from './middlewares/authorization'

const app = express()

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

export default app
