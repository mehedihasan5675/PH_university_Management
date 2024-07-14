/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../error/AppError'
import { CourseSearchableFields } from './course.constant'
import { TCourse, TCourseFaculty } from './course.interface'
import { Course, CourseFaculty } from './course.model'

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload)
  return result
}
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await courseQuery.modelQuery
  return result
}
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload

  //transection
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    //step1:basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    )
    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //check if there is any preRequisiteCourses to update
      //filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course)
      const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, session, runValidators: true },
      )
      if (!deletedPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }

      //filter out the added fields
      const newAddedPreRequisites = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      )

      // console.log(newAddedPreRequisites)
      const newAddedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: newAddedPreRequisites },
          },
        },
        { new: true, session, runValidators: true },
      )
      if (!newAddedPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }
    }
    await session.commitTransaction()
    await session.endSession()
    //
    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    )
    return result
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
  }
}

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    { course: id, $addToSet: { faculties: { $each: payload } } },
    { new: true, upsert: true },
  )
  return result
}
const removeFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    { $pull: { faculties: { $in: payload } } },
    { new: true },
  )
  return result
}
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}
export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesWithCourseIntoDB,
}
