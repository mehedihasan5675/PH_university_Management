import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterControllers } from './academicSemester.controller'
import { AcademicSemesterValidation } from './academicSemester.validation'
const router = express.Router()
router.get('/', AcademicSemesterControllers.getAllAcademicSemesters)
router.patch(
  '/:semesterUpdatedId',
  validateRequest(
    AcademicSemesterValidation.updatedAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
)
router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
)
router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
)
export const AcademicSemesterRoutes = router
