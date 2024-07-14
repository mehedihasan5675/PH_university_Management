/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export interface TUser {
  id: string
  password: string
  needsPasswordChange: boolean
  passwordChangeAt?: Date
  role: 'admin' | 'student' | 'faculty'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}
export type TUserRole = keyof typeof USER_ROLE
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>
  isPasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>
  isUserDeleted(id: string): Promise<boolean>
  isUserStatus(id: string): Promise<string>
  isJwtIssuedBeforePasswordChanged(
    passwordChangedTimestamps: Date,
    jwtIssuedTimestamps: number,
  ): Promise<boolean>
}
