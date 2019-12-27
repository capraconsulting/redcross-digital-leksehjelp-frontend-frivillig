import GRADES from '../grades';
import { VolunteerRole } from '../enums/VolunteerRole';

export const studentGradeFormat = (studentGrade: string): string => {
  if (Number(studentGrade) > 7 || Number(studentGrade) < 14) {
    return GRADES.filter(({ gradeID }) => gradeID === studentGrade).map(
      ({ label }) => label,
    )[0];
  }
  return studentGrade;
};

const roleMap = {
  [VolunteerRole.ADMIN]: 'Admin',
  [VolunteerRole.VOLUNTEER]: 'Frivillig',
};

export const getRoleOptions = () =>
  Object.values(VolunteerRole).map(role => ({
    label: roleMap[role],
    value: role,
  }));
