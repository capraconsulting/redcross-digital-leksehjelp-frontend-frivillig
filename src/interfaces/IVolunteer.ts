import { ISubject } from './ISubject';
import { VolunteerRole } from '../enums/VolunteerRole';

export interface IVolunteer {
  id: string;
  name: string;
  bioText: string;
  email: string;
  imgUrl: string;
  chatID: string;
  subjects?: ISubject[];
  role?: VolunteerRole;
}
