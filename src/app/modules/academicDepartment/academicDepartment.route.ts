import express from 'express'
import validateRequest from '../../middlewares/validateRequest'

import { AcademicDepartmentControllers } from './academicDepartment.controller'
import { AcademicDepartmentValidation } from './academicDepartment.validation'
const router = express.Router()
router.patch(
  '/:departmentUpdatedId',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
)
router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
)
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)
router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
