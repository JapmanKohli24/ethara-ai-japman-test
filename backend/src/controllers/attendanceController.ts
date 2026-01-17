import { Request, Response, NextFunction } from 'express';
import { Attendance } from '../models/attendance';
import { Employee } from '../models/employee';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, IAttendance } from '../types';

// @desc    Mark attendance for an employee
// @route   POST /api/attendance
export const markAttendance = async (
  req: Request,
  res: Response<ApiResponse<IAttendance>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId, date, status } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();

      res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: existingAttendance,
      });
      return;
    }

    const attendance = await Attendance.create({
      employeeId,
      date: attendanceDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records for an employee
// @route   GET /api/attendance/:employeeId
export const getAttendanceByEmployee = async (
  req: Request,
  res: Response<ApiResponse<IAttendance[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    const attendance = await Attendance.find({ employeeId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance records with employee details
// @route   GET /api/attendance
export const getAllAttendance = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const attendance = await Attendance.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: 'employeeId',
          as: 'employee',
        },
      },
      { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          employeeId: 1,
          fullName: '$employee.fullName',
          department: '$employee.department',
          date: 1,
          status: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all attendance records
// @route   DELETE /api/attendance/clear-all
export const clearAllAttendance = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await Attendance.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} attendance records`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear attendance records for a specific employee
// @route   DELETE /api/attendance/clear/:employeeId
export const clearEmployeeAttendance = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    const result = await Attendance.deleteMany({ employeeId });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} attendance records for employee ${employeeId}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single attendance record by ID
// @route   DELETE /api/attendance/record/:id
export const deleteAttendanceRecord = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const record = await Attendance.findByIdAndDelete(id);
    if (!record) {
      return next(new AppError('Attendance record not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a single attendance record by ID
// @route   PUT /api/attendance/record/:id
export const updateAttendanceRecord = async (
  req: Request,
  res: Response<ApiResponse<IAttendance>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    const updateData: { status?: string; date?: Date } = {};
    if (status) updateData.status = status;
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      updateData.date = attendanceDate;
    }

    const record = await Attendance.findByIdAndUpdate(id, updateData, { new: true });
    if (!record) {
      return next(new AppError('Attendance record not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};