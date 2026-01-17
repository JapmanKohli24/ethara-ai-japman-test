import { Router } from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentByName,
  updateDepartment,
  deleteDepartment,
  seedDepartments,
} from '../controllers/departmentController';
import { validateDepartment } from '../middleware/validation';

const router = Router();

router.route('/')
  .get(getAllDepartments)
  .post(validateDepartment, createDepartment);

router.post('/seed', seedDepartments);

router.route('/:name')
  .get(getDepartmentByName)
  .put(validateDepartment, updateDepartment)
  .delete(deleteDepartment);

export default router;
