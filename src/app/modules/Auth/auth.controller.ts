import httpStatus from 'http-status'
import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthService } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body)
  const { refreshToken, accessToken, needsPasswordChange } = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully',
    data: { accessToken, needsPasswordChange },
  })
})
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body
  // console.log(passwordData)
  const result = await AuthService.changePassword(req.user, passwordData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is changed password in successfully',
    data: result,
  })
})
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'access token is retrieve successfully',
    data: result,
  })
})
export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
}
