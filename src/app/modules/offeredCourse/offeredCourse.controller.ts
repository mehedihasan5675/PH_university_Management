import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OfferedCourseService } from './offeredCourse.service'

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.createOfferedCourseIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully',
    data: result,
  })
})

// const getAllOfferedCourse = catchAsync(
//   async (req: Request, res: Response) => {
//     const result =
//       await OfferedCourseService.getAllOfferedCourseFromDB(
//         req.body,
//       )
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Offered Course fetch successfully',
//       data: result,
//     })
//   },
// )

// const getSingleOfferedCourse = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params
//     const result =
//       await OfferedCourseService.getSingleOfferedCourseFromDB(id)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Offered Course is retrieved successfully',
//       data: result,
//     })
//   },
// )

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await OfferedCourseService.updateOfferedCourseIntoDB(
    id,
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is updated successfully',
    data: result,
  })
})
const deleteOfferedCourseFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await OfferedCourseService.deleteOfferedCourseFromDB(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse deleted successfully',
      data: result,
    })
  },
)

export const OfferedCourseController = {
  createOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
}
