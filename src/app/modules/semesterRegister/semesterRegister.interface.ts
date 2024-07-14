import { Types } from 'mongoose'
export type TSemesterRegistrationStatus = 'UPCOMING' | 'ONGOING' | 'ENDED'
export type TSemesterRegistration = {
  academicSemester: Types.ObjectId
  status: 'UPCOMING' | 'ONGOING' | 'ENDED'
  startDate: Date
  endDate: Date
  minCredit: number
  maxCredit: number
}
