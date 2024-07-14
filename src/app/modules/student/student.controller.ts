/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { StudentServices } from './student.service'

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query)
  // console.log(result)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  })
})
const getSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId
  const result = await StudentServices.getSingleStudentFromDB(studentId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Student retrieved successfullly',
    data: result,
  })
})
const deleteStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId
  const result = await StudentServices.deleteStudentFromDB(studentId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Student deleted successfullly',
    data: result,
  })
})

const updateStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId
  const { student } = req.body
  const result = await StudentServices.updateStudentFromDB(studentId, student)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Student updated successfullly',
    data: result,
  })
})
export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
}
