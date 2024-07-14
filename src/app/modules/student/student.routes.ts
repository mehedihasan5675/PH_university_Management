import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { StudentControllers } from './student.controller'
import { studentValidation } from './student.validation'

const router = express.Router()

router.get('/', StudentControllers.getAllStudents)
router.get('/:studentId', StudentControllers.getSingleStudent)
router.patch(
  '/:studentId',
  validateRequest(studentValidation.updateStudentValidationSchema),
  StudentControllers.updateStudent,
)
router.delete('/:studentId', StudentControllers.deleteStudent)
export const StudentRoutes = router
