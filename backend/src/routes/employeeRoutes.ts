import { Router } from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} from '../controllers/employeeController';
import { validateEmployee } from '../middleware/validation';

const router = Router();

router.route('/')
  .get(getAllEmployees)
  .post(validateEmployee, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .delete(deleteEmployee);

export default router;