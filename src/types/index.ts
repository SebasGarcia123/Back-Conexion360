import { Document, Types } from 'mongoose'

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  role: Types.ObjectId
  firstName: string
  lastName: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  bornDate?: Date
  isActive: boolean
  checkPassword(potentialPassword: string): Promise<{ isOk: boolean; isLocked: boolean }>
}

export type GovernmentIdType = 'cuil' | 'cuit' | 'dni' | 'lc' | 'le' | 'pas'

// Role Types
export interface IRole extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  permissions: string[]
  isActive: boolean
}

export interface IBuilding extends Document {
  _id: Types.ObjectId
  name: string
  address: string
  city: string
  country: string
  postalCode: string
  isActive: boolean
}

export interface ISpace extends Document {
  _id: Types.ObjectId
  building: Types.ObjectId
  pictureUrl: string
  spaceType: string
  description: string
  capacity: number
  pricePerDay: number
  isActive: boolean
}

export type spaceType = 'floor' | 'office' | 'desk'

export interface IReservation extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  dateFrom: Date
  dateTo: Date
  spaceId: Types.ObjectId
  totalPrice: number
  isActive: boolean
  rentTipe: rentType
}

export type rentType = 'day' | 'week' | 'month' | 'year'

// JWT Payload
export interface JWTPayload {
  _id: string
  email: string
  role: string
  iat?: number
  exp?: number
  iss?: string
}

// Request Extensions - using module augmentation instead of namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload
    isAdmin?(): boolean
    isClient?(): boolean
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role: string
  firstName: string
  lastName: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  bornDate?: Date
}

export interface CreateBuildingRequest {
  name: string
  address: string
  city: string
  country: string
  postalCode: string
}

export interface CreateSpaceRequest {
  building: string
  pictureUrl: string
  spaceType: spaceType
  description: string
  capacity: number
  pricePerDay: number
}

export interface CreateReservationRequest {
  userId: string
  dateFrom: Date
  dateTo: Date
  spaceId: string
  totalPrice: number
  rentTipe: rentType
}

// Environment Variables
export interface EnvironmentVariables {
  NODE_ENV?: string
  PORT?: string
  MONGO_URL?: string
  MONGO_DB?: string
  JWT_SECRET?: string
  JWT_ISSUER?: string
}
