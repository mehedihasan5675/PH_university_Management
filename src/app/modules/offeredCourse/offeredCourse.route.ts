import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseController } from './offeredCourse.controller'
import { OfferedCourseValidation } from './offeredCourse.validation'

const router = express.Router()
// router.get('/', OfferedCourseController.getAllOfferedCourse)
router.patch(
  '/:id',
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
)
router.delete('/:id', OfferedCourseController.deleteOfferedCourseFromDB)
// router.get('/:id', OfferedCourseController.getSingleOfferedCourse)
router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
)
export const OfferedCourseRoutes = router
