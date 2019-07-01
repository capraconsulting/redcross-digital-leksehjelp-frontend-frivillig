import GRADES from '../grades';

export const studentGradeFormat = (studentGrade: string): string => {
  if (parseInt(studentGrade) < 8 || parseInt(studentGrade) > 13) {
    return studentGrade;
  }
  return GRADES.filter(({ gradeID }) => gradeID === studentGrade).map(
    ({ label }) => label,
  )[0];
};
