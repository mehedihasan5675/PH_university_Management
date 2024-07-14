import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyValidation } from './academicFaculty.Validation'
import { AcademicFacultyControllers } from './academicFaculty.controller'
const router = express.Router()
router.patch(
  '/:facultyUpdatedId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
)
router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty)
router.get('/', AcademicFacultyControllers.getAllAcademicFacultys)
router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
)

export const AcademicFacultyRoutes = router
