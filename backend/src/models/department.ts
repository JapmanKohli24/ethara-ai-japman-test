import mongoose, { Document, Schema } from 'mongoose';
import { IDepartment } from '../types';

export interface IDepartmentDocument extends IDepartment, Document {}

const departmentSchema = new Schema<IDepartmentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Department name must be at least 2 characters'],
      maxlength: [50, 'Department name must not exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description must not exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartmentDocument>('Department', departmentSchema);
