/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
const app: Application = express()
//parsers
app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173'] }))
app.use(cookieParser())
//application routes
app.use('/api/v1/', router)

const test = (req: Request, res: Response) => {
  const a = 10
  res.send({ a })
}
app.get('/', test)

//global err handler
app.use(globalErrorHandler)
//not Found route
app.use(notFound)
export default app
