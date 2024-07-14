// import httpStatus from 'http-status'
// import QueryBuilder from '../../builder/QueryBuilder'
// import AppError from '../../error/AppError'
// import { AcademicSemester } from '../academicSemester/academicSemester.model'
// import { RegistrationStatus } from './semesterRegister.constant'
// import { TSemesterRegistration } from './semesterRegister.interface'
// import { SemesterRegistration } from './semesterRegister.model'

import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { Course } from '../Course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { SemesterRegistration } from '../semesterRegister/semesterRegister.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { OfferedCourse } from './offeredCourse.model'
import hasTimeConflict from './offeredCourse.utils'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload
  //check if the semester registration id is exists
  const isSemesterRegisterExist =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegisterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'semester registration not found')
  }
  //
  const academicSemester = isSemesterRegisterExist.academicSemester
  //
  const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }
  //
  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academinc Department not found')
  }
  //
  const isCourseExist = await Course.findById(course)
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  //
  const isFacultyExist = await Faculty.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  //check if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  })
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} is not belog to this ${isAcademicFacultyExist.name}`,
    )
  }

  //check if the same course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    })
  if (isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered Course with same section is already exists`,
    )
  }

  //get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = { days, startTime, endTime }
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not availble at that time!choose other time or day`,
    )
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester })
  return result
}
// const getAllSemesterRegistrationFromDB = async (
//   query: Record<string, unknown>,
// ) => {
//   const semesterRegistrationQuery = new QueryBuilder(
//     SemesterRegistration.find().populate('academicSemester'),
//     query,
//   )
//     .filter()
//     .sort()
//     .paginate()
//     .fields()
//   const result = await semesterRegistrationQuery.modelQuery
//   return result
// }
// const getSingleSemesterRegistrationFromDB = async (id: string) => {
//   const result =
//     await SemesterRegistration.findById(id).populate('academicSemester')
//   return result
// }
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload

  const isOfferedCourseExist = await OfferedCourse.findById(id)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const isFacultyExist = await Faculty.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const semesterRegistrationId = isOfferedCourseExist.semesterRegistration
  //get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration: semesterRegistrationId,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = { days, startTime, endTime }

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not availble at that time!choose other time or day`,
    )
  }
  const semesterRegistration = await SemesterRegistration.findById(
    semesterRegistrationId,
  )
  const semesterRegistrationStatus = semesterRegistration?.status
  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you can not update this offered course as it it ${semesterRegistrationStatus}`,
    )
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}
const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistation).select('status')

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    )
  }

  const result = await OfferedCourse.findByIdAndDelete(id)

  return result
}
export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
}
