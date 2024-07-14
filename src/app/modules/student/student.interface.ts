// 1. Create an interface representing a document in MongoDB.

import { Model, Types } from 'mongoose'

export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}
export type TUserName = {
  firstName: string
  middleName: string
  lastName: string
}
export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}
export type TStudent = {
  id: string
  password: string
  user: Types.ObjectId
  name: TUserName
  gender: 'male' | 'female'
  dateOfBirth?: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'B+' | 'B-'
  email: string
  avatar?: string
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImg?: string
  admissionSemester: Types.ObjectId
  academicDepartment: Types.ObjectId
  isDeleted: boolean
}
//for creating static method

export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TStudent | null>
}

//for creating instance method

// export type StudentMethods = {
//   isUserExists(id: string): Promise<TStudent | null>
// }
// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >
