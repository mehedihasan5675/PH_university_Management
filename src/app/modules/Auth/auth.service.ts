import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import AppError from '../../error/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import createToken from './auth.utils'
const loginUser = async (payload: TLoginUser) => {
  //checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found!')
  }
  //checking if the user is already deleted
  // const isDeleted = user?.isDeleted
  if (await User.isUserDeleted(payload.id)) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already deleted! ')
  }
  //checking if the user is blocked
  // const isUserStatus = user?.status
  if ((await User.isUserStatus(payload.id)) === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already blocked! ')
  }
  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched! ')
  }
  //Access Granted:Send AccessToken,Refresh
  //create token and sent to the client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  //checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found!')
  }
  //checking if the user is already deleted
  // const isDeleted = user?.isDeleted
  if (await User.isUserDeleted(userData.id)) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already deleted! ')
  }
  //checking if the user is blocked
  // const isUserStatus = user?.status
  if ((await User.isUserStatus(userData.id)) === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already blocked! ')
  }
  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched! ')
  }
  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  )
  return null
}
const refreshToken = async (reToken: string) => {
  //check if the token is valid
  // invalid token
  const decoded = jwt.verify(
    reToken,
    config.jwt_refresh_secret as string,
  ) as JwtPayload
  //role checking
  const { userId, iat } = decoded
  // console.log(decoded, 'hi')
  //==
  //checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found!')
  }
  //checking if the user is already deleted
  // const isDeleted = user?.isDeleted
  if (await User.isUserDeleted(userId)) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already deleted! ')
  }
  //checking if the user is blocked
  // const isUserStatus = user?.status
  if ((await User.isUserStatus(userId)) === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is already blocked! ')
  }
  //==
  if (
    user.passwordChangeAt &&
    (await User.isJwtIssuedBeforePasswordChanged(
      user.passwordChangeAt,
      iat as number,
    ))
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'you are not Authorized! ')
  }

  //create refresh token and sent to the client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )
  return { accessToken }
}
export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
}
