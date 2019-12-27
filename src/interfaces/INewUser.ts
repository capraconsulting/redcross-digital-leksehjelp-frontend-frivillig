import { VolunteerRole } from '../enums/VolunteerRole';

export interface INewUser {
  name: string;
  email: string;
  role: VolunteerRole;
}
