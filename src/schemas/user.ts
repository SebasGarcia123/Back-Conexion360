import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, GovernmentIdType } from '../types/index'

const { ObjectId } = Schema.Types

// Email validation using regex (more secure than mongoose-validator)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailValidator = {
  validator: function (v: string): boolean {
    return emailRegex.test(v)
  },
  message: 'Please provide a valid email address',
}

const governmentIdTypes: GovernmentIdType[] = ['cuil', 'cuit', 'dni', 'lc', 'le', 'pas']

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: emailValidator,
    },
    password: { type: String, required: true, select: false },
    role: { type: ObjectId, ref: 'Role', required: true },
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    governmentId: {
      type: { type: String, enum: governmentIdTypes },
      number: { type: String, trim: true },
    },
    bornDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

userSchema.index({ 'governmentId.type': 1, 'governmentId.number': 1 }, { unique: true })

userSchema.method(
  'checkPassword',
  async function checkPassword(
    potentialPassword: string,
  ): Promise<{ isOk: boolean; isLocked: boolean }> {
    if (!potentialPassword) {
      return Promise.reject(new Error('Password is required'))
    }

    const isMatch = await bcrypt.compare(potentialPassword, this.password)

    return { isOk: isMatch, isLocked: !this.isActive }
  },
)

const User = mongoose.model<IUser>('User', userSchema)

export default User
