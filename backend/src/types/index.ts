export interface IEmployee {
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IAttendance {
    employeeId: string;
    date: Date;
    status: 'Present' | 'Absent';
    createdAt?: Date;
  }

  export interface IDepartment {
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }