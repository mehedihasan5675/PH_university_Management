import { z } from 'zod'

// Define userNameSchema using Zod
const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First Name cannot be more than 20 characters')
    .min(1, 'First Name is required')
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First Name must be capitalized',
      },
    ),
  middleName: z.string().min(1, 'Middle Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
})

// Define guardianSchema using Zod
const createguardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
})

// Define localGuardianSchema using Zod
const createGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Local Guardian Occupation is required'),
  contactNo: z.string().min(1, 'Local Guardian Contact Number is required'),
  address: z.string().min(1, 'Local Guardian Address is required'),
})

// Define studentSchema using Zod
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z
        .enum(['male', 'female', 'other'], {
          errorMap: () => ({ message: '{VALUE} is not a valid gender' }),
        })
        .refine((val) => val !== undefined, 'Gender is required'),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email('{VALUE} is not a valid email type')
        .min(1, 'Email is required'),
      contactNo: z.string().min(1, 'Contact Number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact Number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'B+', 'B-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present Address is required'),
      permanentAddress: z.string().min(1, 'Permanent Address is required'),
      guardian: createguardianValidationSchema,
      localGuardian: createGuardianValidationSchema,
      profileImg: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
})

//for update schema
const updateUserNameValidationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .max(20, 'First Name cannot be more than 20 characters')
      .min(1, 'First Name is required')
      .refine(
        (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
        {
          message: 'First Name must be capitalized',
        },
      ),
    middleName: z.string().min(1, 'Middle Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
  })
  .partial()

const updateguardianValidationSchema = z
  .object({
    fatherName: z.string().min(1, 'Father Name is required'),
    fatherOccupation: z.string().min(1, 'Father Occupation is required'),
    fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
    motherName: z.string().min(1, 'Mother Name is required'),
    motherOccupation: z.string().min(1, 'Mother Occupation is required'),
    motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
  })
  .partial()

const updateGuardianValidationSchema = z
  .object({
    name: z.string().min(1, 'Local Guardian Name is required'),
    occupation: z.string().min(1, 'Local Guardian Occupation is required'),
    contactNo: z.string().min(1, 'Local Guardian Contact Number is required'),
    address: z.string().min(1, 'Local Guardian Address is required'),
  })
  .partial()

const updateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: updateUserNameValidationSchema,
          gender: z
            .enum(['male', 'female', 'other'], {
              errorMap: () => ({ message: '{VALUE} is not a valid gender' }),
            })
            .refine((val) => val !== undefined, 'Gender is required')
            .optional(),
          dateOfBirth: z.string().optional(),
          email: z
            .string()
            .email('{VALUE} is not a valid email type')
            .min(1, 'Email is required')
            .optional(),
          contactNo: z.string().min(1, 'Contact Number is required').optional(),
          emergencyContactNo: z
            .string()
            .min(1, 'Emergency Contact Number is required')
            .optional(),
          bloodGroup: z
            .enum(['A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'B+', 'B-'])
            .optional(),
          presentAddress: z
            .string()
            .min(1, 'Present Address is required')
            .optional(),
          permanentAddress: z
            .string()
            .min(1, 'Permanent Address is required')
            .optional(),
          guardian: updateguardianValidationSchema,
          localGuardian: updateGuardianValidationSchema,
          profileImg: z.string().optional(),
          admissionSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
        })
        .partial(),
    })
    .partial(),
})
export const studentValidation = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
}
