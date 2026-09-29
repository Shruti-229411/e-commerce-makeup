import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  profileImage?: string;
  dateOfBirth?: Date;
  preferences?: {
    skinType?: string;
    hairType?: string;
    newsletter?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true },
    profileImage: { type: String, default: '' },
    dateOfBirth: { type: Date },
    preferences: {
      skinType: { type: String, default: 'Normal' },
      hairType: { type: String, default: 'Normal' },
      newsletter: { type: Boolean, default: true }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
