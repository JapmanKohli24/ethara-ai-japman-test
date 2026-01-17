import { Router } from 'express';
import {
  markAttendance,
  getAttendanceByEmployee,
  getAllAttendance,
  clearAllAttendance,
  clearEmployeeAttendance,
  deleteAttendanceRecord,
  updateAttendanceRecord,
} from '../controllers/attendanceController';
import { validateAttendance } from '../middleware/validation';

const router = Router();

router.route('/')
  .get(getAllAttendance)
  .post(validateAttendance, markAttendance);

router.delete('/clear-all', clearAllAttendance);
router.delete('/clear/:employeeId', clearEmployeeAttendance);

router.route('/record/:id')
  .put(updateAttendanceRecord)
  .delete(deleteAttendanceRecord);

router.route('/:employeeId')
  .get(getAttendanceByEmployee);

export default router;