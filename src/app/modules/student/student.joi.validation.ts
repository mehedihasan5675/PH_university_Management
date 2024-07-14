import Joi from 'joi'

//creating a schema validation with joi
const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .custom((value, helpers) => {
      const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
      if (firstNameStr !== value) {
        return helpers.error('any.custom', {
          message: 'First Name must be capitalized',
        })
      }
      return value
    })
    .max(20)
    .required()
    .messages({
      'string.base': 'First Name must be a string',
      'string.empty': 'First Name is required',
      'string.max': 'First Name cannot be more than 20 characters',
    }),
  middleName: Joi.string().required().messages({
    'string.empty': 'Middle Name is required',
  }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Last Name must contain only letters',
      'string.empty': 'Last Name is required',
    }),
})

// Define the Joi schema for guardian
const guardianSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': 'Father Name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': 'Father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.empty': 'Father Contact Number is required',
  }),
  motherName: Joi.string().required().messages({
    'string.empty': 'Mother Name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': 'Mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'string.empty': 'Mother Contact Number is required',
  }),
})

// Define the Joi schema for localGuardian
const localGuardianSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Local Guardian Name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Local Guardian Occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Local Guardian Contact Number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Local Guardian Address is required',
  }),
})

// Define the Joi schema for student
const createStudentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  name: userNameSchema.required().messages({
    'object.base': 'Name is required',
  }),
  gender: Joi.string().valid('male', 'female').required().messages({
    'any.only': '{#value} is not a valid gender',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required().messages({
    'string.email': '{#value} is not a valid email',
    'string.empty': 'Email is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'B+', 'B-')
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent Address is required',
  }),
  guardian: guardianSchema.required().messages({
    'object.base': 'Guardian information is required',
  }),
  localGuardian: localGuardianSchema.required().messages({
    'object.base': 'Local Guardian information is required',
  }),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#value} is not a valid status',
  }),
})
export default createStudentValidationSchema
