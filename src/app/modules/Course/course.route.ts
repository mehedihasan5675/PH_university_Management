import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { USER_ROLE } from '../user/user.constant'
import { CourseControllers } from './course.controller'
import { CourseValidations } from './course.validation'

const router = express.Router()

router.post(
  '/create-course',
  // auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
)
router.get(
  '/',
  // auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getAllCourses,
)
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getSingleCourse,
)
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
)
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
)
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
)
router.delete('/:id', CourseControllers.deleteCourse)
export const CourseRoutes = router
