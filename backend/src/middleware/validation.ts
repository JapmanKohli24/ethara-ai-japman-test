import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { employeeId, fullName, email, department } = req.body;

  employeeId = employeeId?.trim();
  fullName = fullName?.trim();
  email = email?.trim();
  department = department?.trim();

  req.body = { ...req.body, employeeId, fullName, email, department };

  if (!employeeId || !fullName || !email || !department) {
    return next(new AppError('All fields are required: employeeId, fullName, email, department', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // Email length < 45 characters
  if (email.length > 45) {
    return next(new AppError('Email must not exceed 45 characters', 400));
  }

  // 2 characters < Full name length < 100 characters
  if (fullName.length < 2) {
    return next(new AppError('Full name must be at least 2 characters', 400));
  }

  if (fullName.length > 100) {
    return next(new AppError('Full name must not exceed 100 characters', 400));
  }

  next();
};

export const validateAttendance = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { employeeId, date, status } = req.body;

  employeeId = employeeId?.trim();
  status = status?.trim();

  req.body = { ...req.body, employeeId, status };

  if (!employeeId || !date || !status) {
    return next(new AppError('All fields are required: employeeId, date, status', 400));
  }

  if (!['Present', 'Absent'].includes(status)) {
    return next(new AppError('Status must be either Present or Absent', 400));
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return next(new AppError('Please provide a valid date', 400));
  }

  next();
};

export const validateDepartment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { name, description } = req.body;

  name = name?.trim();
  description = description?.trim();

  req.body = { ...req.body, name, description };

  if (!name) {
    return next(new AppError('Department name is required', 400));
  }

  // 2 characters < Department name length < 50 characters
  if (name.length < 2) {
    return next(new AppError('Department name must be at least 2 characters', 400));
  }

  if (name.length > 50) {
    return next(new AppError('Department name must not exceed 50 characters', 400));
  }

  // Description length < 200 characters, can be left empty - treated as optional
  if (description && description.length > 200) {
    return next(new AppError('Description must not exceed 200 characters', 400));
  }

  next();
};