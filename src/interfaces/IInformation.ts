import { IOpeningHours } from './IOpeningHours';
import { IOtherOpeningHours } from './IOtherOpeningHours';

export interface IInformation {
  isOpen: boolean;
  announcement: string;
  monday: IOpeningHours;
  tuesday: IOpeningHours;
  wednesday: IOpeningHours;
  thursday: IOpeningHours;
  friday: IOpeningHours;
  saturday: IOpeningHours;
  sunday: IOpeningHours;
  other: IOtherOpeningHours;
}
