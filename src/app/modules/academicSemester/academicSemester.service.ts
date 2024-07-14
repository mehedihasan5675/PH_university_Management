import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { academicSemesterNameCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //semester name is related semester code??

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester Code doesn't match")
  }
  const result = await AcademicSemester.create(payload)
  return result
}
const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find()
  return result
}
const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemester.findOne({ _id: semesterId })
  return result
}
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.EXPECTATION_FAILED, 'Invalid Semester Code')
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}
export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
}
