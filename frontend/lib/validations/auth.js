// lib/validations/auth.js
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

export const completeProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  city_id: z.string().optional(),
  profession_id: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
})