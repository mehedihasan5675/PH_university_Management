import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is created successfully',
    data: result,
  })
})
const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department fetch successfully',
    data: result,
  })
})
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      req.params.departmentId,
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department fetch successfully',
    data: result,
  })
})
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentUpdatedId } = req.params
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentUpdatedId,
      req.body,
    )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is updated succesfully',
    data: result,
  })
})

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
}
