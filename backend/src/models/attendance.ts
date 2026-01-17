import mongoose, { Document, Schema } from 'mongoose';
import { IAttendance } from '../types';

export interface IAttendanceDocument extends IAttendance, Document {}

const attendanceSchema = new Schema<IAttendanceDocument>(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      ref: 'Employee',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Present', 'Absent'],
        message: 'Status must be either Present or Absent',
      },
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendanceDocument>('Attendance', attendanceSchema);