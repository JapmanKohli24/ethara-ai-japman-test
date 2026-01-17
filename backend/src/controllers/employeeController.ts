import { Request, Response, NextFunction } from 'express';
import { Employee } from '../models/employee';
import { Attendance } from '../models/attendance';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, IEmployee } from '../types';

// @desc    Create a new employee
// @route   POST /api/employees
export const createEmployee = async (
  req: Request,
  res: Response<ApiResponse<IEmployee>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId, fullName, email, department } = req.body;

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      department,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/employees
export const getAllEmployees = async (
  req: Request,
  res: Response<ApiResponse<IEmployee[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
export const getEmployeeById = async (
  req: Request,
  res: Response<ApiResponse<IEmployee>>,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an employee and their attendance records
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.id });

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    // Delete all attendance records for this employee
    await Attendance.deleteMany({ employeeId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Employee and attendance records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};