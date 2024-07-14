import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CourseServices } from './course.service'

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  })
})
const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Courses fetch successfully',
    data: result,
  })
})
const getSingleCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getSingleCourseFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetch successfully',
    data: result,
  })
})
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseServices.deleteCourseFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted succesfully',
    data: result,
  })
})
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params
  const { faculties } = req.body
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assign Faculties  is updated succesfully with a Course',
    data: result,
  })
})
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params
  const { faculties } = req.body
  const result = await CourseServices.removeFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assign Faculties  is removed succesfully From  Course',
    data: result,
  })
})
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseServices.updateCourseIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated succesfully',
    data: result,
  })
})

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
}
