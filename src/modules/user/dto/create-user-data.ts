import { RoleCode, UserStatus } from '../../../generated/prisma/enums.js';

export interface CreateUserData {
  email: string;
  fullName: string;
  passwordHash: string;
  phone?: string;
  citizenId?: string;
  age?: number;
  status?: UserStatus;
  teamId: string;
  employmentType: string;
  roleCodes: RoleCode[];
}
