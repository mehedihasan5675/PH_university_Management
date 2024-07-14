import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { USER_ROLE } from '../user/user.constant'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'

const router = express.Router()
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
)
router.post(
  '/change-password',
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
)
router.post(
  '/refresh-token',

  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
)
export const AuthRoutes = router
