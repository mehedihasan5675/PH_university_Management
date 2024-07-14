import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is created successfully',
    data: result,
  })
})
const getAllAcademicFacultys = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty fetch successfully',
    data: result,
  })
})
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
    req.params.facultyId,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty fetch successfully',
    data: result,
  })
})
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyUpdatedId } = req.params
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    facultyUpdatedId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is retrieved succesfully',
    data: result,
  })
})

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFacultys,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
}
