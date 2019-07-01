import GRADES from '../grades';

export const studentGradeFormat = (studentGrade: string): string => {
  return GRADES.filter(({ gradeID }) => gradeID === studentGrade).map(
    ({ label }) => label,
  )[0];
};
