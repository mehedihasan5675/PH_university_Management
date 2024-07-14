import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegistrationController } from './semesterRegister.controller'
import { SemesterRegistrationValidations } from './semesterRegister.validation'

const router = express.Router()
router.get('/', SemesterRegistrationController.getAllSemesterRegistration)
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
)
router.get('/:id', SemesterRegistrationController.getSingleSemesterRegistration)
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
)
router.delete('/:id', SemesterRegistrationController.deleteSemesterRegistration)

export const SemesterRegistrationRoutes = router
