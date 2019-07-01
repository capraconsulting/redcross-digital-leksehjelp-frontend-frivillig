import GRADES from '../grades';

export const studentGradeFormat = (studentGrade: string): string => {
  if (Number(studentGrade) > 7 || Number(studentGrade) < 14) {
    return GRADES.filter(({ gradeID }) => gradeID === studentGrade).map(
      ({ label }) => label,
    )[0];
  }
  return studentGrade;
};
