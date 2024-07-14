import { TSemesterRegistrationStatus } from './semesterRegister.interface'

export const semesterRegistrationStatus: TSemesterRegistrationStatus[] = [
  'UPCOMING',
  'ONGOING',
  'ENDED',
]
export const RegistrationStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const
