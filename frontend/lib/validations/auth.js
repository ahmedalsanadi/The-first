// lib/validations/auth.js - Update completeProfileSchema
import { z } from 'zod'
import { YEMEN_PHONE_PREFIXES } from '@/config/constants'

const phoneValidation = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[0-9]+$/, 'Phone number must contain only digits')
  .refine((phone) => {
    // If it's a Yemen number, validate the format
    if (phone.length === 9) {
      const prefix = phone.substring(0, 2)
      return YEMEN_PHONE_PREFIXES.includes(prefix)
    }
    return phone.length >= 8 && phone.length <= 15
  }, 'Invalid phone number format')

export const initiateRegistrationSchema = z.object({
  phone: phoneValidation,
  country_code: z
    .string()
    .min(1, 'Country code is required')
    .regex(/^\+[0-9]{1,4}$/, 'Invalid country code format'),
})

export const verifyOtpSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  country_code: z.string().min(1, 'Country code is required'),
  otp_code: z
    .string()
    .length(4, 'Verification code must be 4 digits')
    .regex(/^[0-9]{4}$/, 'Verification code must contain only numbers'),
})

export const setPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export const loginSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  country_code: z.string().min(1, 'Country code is required'),
  password: z.string().min(1, 'Password is required'),
})

// Enhanced complete profile schema with proper validation
export const completeProfileSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length >= 2, {
      message: 'Name must be at least 2 characters'
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().email().safeParse(val).success, {
      message: 'Invalid email address'
    }),
  city_id: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: 'Invalid city selection'
    }),
  profession_id: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: 'Invalid profession selection'
    }),
  birth_date: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Check if it's a valid date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(val)) return false;
      
      // Check if it's a valid date and not in the future
      const date = new Date(val);
      const today = new Date();
      return date <= today && date >= new Date('1900-01-01');
    }, {
      message: 'Invalid birth date'
    }),
  gender: z
    .string()
    .optional()
    .refine((val) => !val || ['male', 'female'].includes(val), {
      message: 'Invalid gender selection'
    }),
})