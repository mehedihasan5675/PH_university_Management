/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { createAdminValidationSchema } from '../Admin/admin.validation'
import { createFacultyValidationSchema } from '../Faculty/faculty.validation'
import { studentValidation } from '../student/student.validation'
import { USER_ROLE } from './user.constant'
import { UserControllers } from './user.controller'
const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidation.createStudentValidationSchema),
  UserControllers.createStudent,
)
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
)

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
)
export const UserRoutes = router
