import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../config'
import { TUser, UserModel } from './user.interface'
const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook :we wiill save the data')
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  //hashing password and save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// post save middleware /hook
userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
  // console.log(this, 'post hook :we save our  data')
})
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password')
}
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword)
}

userSchema.statics.isUserDeleted = async function (id: string) {
  const result = await User.findOne({ id })
  return result?.isDeleted
}
userSchema.statics.isUserStatus = async function (id: string) {
  const result = await User.findOne({ id })
  return result?.status
}
userSchema.statics.isJwtIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamps: Date,
  jwtIssuedTimestamps: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamps).getTime()
  const JwtIssuedTimeInmiliseconds = jwtIssuedTimestamps * 1000

  return passwordChangedTime > JwtIssuedTimeInmiliseconds
  // return passwordChangedTimestamps>jwtIssuedTimestamps
}
export const User = model<TUser, UserModel>('User', userSchema)
