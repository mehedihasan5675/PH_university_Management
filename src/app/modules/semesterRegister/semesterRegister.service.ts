/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../error/AppError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { OfferedCourse } from '../offeredCourse/offeredCourse.model'
import { RegistrationStatus } from './semesterRegister.constant'
import { TSemesterRegistration } from './semesterRegister.interface'
import { SemesterRegistration } from './semesterRegister.model'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester
  //check if there any register semester already 'UPCOMING'|"ONGOING"
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    })
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `There is already a ${isThereAnyUpcomingOrOngoingSemester.status} register semester`,
    )
  }
  //check if the semester is exist
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester)
  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This academic semester not found')
  }
  // check if the semester already register
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  })
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This academic semester is already register',
    )
  }

  const result = await SemesterRegistration.create(payload)
  return result
}
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await semesterRegistrationQuery.modelQuery
  return result
}
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester')
  return result
}
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if the requested semester exits
  const isSemesterRegisterExist = await SemesterRegistration.findById(id)
  if (!isSemesterRegisterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This  semester registration is not found',
    )
  }
  //if the requested semester registration is ended we will not update anything
  const currentSemesterStatus = isSemesterRegisterExist?.status
  const requestedStatus = payload?.status
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    )
  }

  //UPCOMING=>ONGOING=>ENDED follow this serial for status update

  //UPCOMING to ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'you can not  directly change status from UPCOMING to ENDED',
    )
  }

  //ONGOING to UPCOMING
  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` you can not  directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}
const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id)

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not found !',
    )
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
    )
  }

  const session = await mongoose.startSession()

  //deleting associated offered courses

  try {
    session.startTransaction()

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      },
    )

    if (!deletedOfferedCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      )
    }

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      })

    if (!deletedSemisterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      )
    }

    await session.commitTransaction()
    await session.endSession()

    return null
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
}
