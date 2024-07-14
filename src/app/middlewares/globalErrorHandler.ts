/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import AppError from '../error/AppError'
import { handleCastError } from '../error/handleCastError'
import { handleDuplicateError } from '../error/handleDuplicateError'
import handleValidationError from '../error/handleValidationError'
import { handleZodError } from '../error/handleZodError'
import { TErrorSource } from '../interface/error'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting dafault value
  let statusCode = 500
  let message = 'Something went wrong'

  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]
  //zod validation error=>property er value er requirement onuzayi na hole ei error ase
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources

    //mongoose validation error handle=> Type onuzayi jodi property and value type na dewa hoi tobe ei error ase
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources

    //mongoose cast error handle=>api te vul id param a dile ei error ase
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources

    //code 11000 => duplicate id pele ei error ase
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources

    //AppError er error manage
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
    //normal Error er jnno
  } else if (err instanceof Error) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler
