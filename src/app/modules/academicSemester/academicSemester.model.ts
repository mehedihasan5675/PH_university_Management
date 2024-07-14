import httpStatus from 'http-status'
import { Schema, model } from 'mongoose'
import AppError from '../../error/AppError'
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, required: true, enum: AcademicSemesterName },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    year: { type: String, required: true },
    startMonth: { type: String, required: true, enum: Months },
    endMonth: { type: String, required: true, enum: Months },
  },
  {
    timestamps: true,
  },
)

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExistForSameYear = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  })

  if (isSemesterExistForSameYear) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester is already exists!')
  }
  next()
})
export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)
