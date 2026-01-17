import { Request, Response, NextFunction } from 'express';
import { Department } from '../models/department';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, IDepartment } from '../types';

// @desc    Create a new department
// @route   POST /api/departments
export const createDepartment = async (
  req: Request,
  res: Response<ApiResponse<IDepartment>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const department = await Department.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /api/departments
export const getAllDepartments = async (
  req: Request,
  res: Response<ApiResponse<IDepartment[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department by name
// @route   GET /api/departments/:name
export const getDepartmentByName = async (
  req: Request,
  res: Response<ApiResponse<IDepartment>>,
  next: NextFunction
): Promise<void> => {
  try {
    const department = await Department.findOne({ name: req.params.name });

    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:name
export const updateDepartment = async (
  req: Request,
  res: Response<ApiResponse<IDepartment>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const currentName = req.params.name;

    const department = await Department.findOne({ name: currentName });

    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    if (name) department.name = name;
    if (description !== undefined) department.description = description;

    await department.save();

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:name
export const deleteDepartment = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const department = await Department.findOneAndDelete({ name: req.params.name });

    if (!department) {
      return next(new AppError('Department not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const DEFAULT_DEPARTMENTS = [
  { name: 'Engineering', description: 'Software development and technical teams' },
  { name: 'Sales', description: 'Sales and business development' },
  { name: 'Marketing', description: 'Marketing and brand management' },
  { name: 'HR', description: 'Human resources and recruitment' },
  { name: 'Finance', description: 'Financial planning and accounting' },
  { name: 'Operations', description: 'Day-to-day business operations' },
];

// @desc    Seed default departments (only adds if none exist)
// @route   POST /api/departments/seed
export const seedDepartments = async (
  req: Request,
  res: Response<ApiResponse<IDepartment[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const existingCount = await Department.countDocuments();
    
    if (existingCount > 0) {
      const departments = await Department.find().sort({ name: 1 });
      res.status(200).json({
        success: true,
        message: 'Departments already exist, skipping seed',
        data: departments,
      });
      return;
    }

    const departments = await Department.insertMany(DEFAULT_DEPARTMENTS);

    res.status(201).json({
      success: true,
      message: 'Default departments seeded successfully',
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};
