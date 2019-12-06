import React, { useEffect, useState } from 'react';
import { getMestringSubjectList, getSubjectList } from '../services';
import { ISubject } from '../interfaces';
import AdminSubjectsComponent from '../components/AdminSubjectsComponent';
import '../styles/admin-subjects.less';

const AdminSubjectsContainer = () => {
  const [leksehjelpSubjects, setLeksehjelpSubjects] = useState<ISubject[]>([]);
  const [mestringSubjects, setMestringSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    (async () => {
      const subjects = await getSubjectList<ISubject[]>();
      setLeksehjelpSubjects(subjects);
      const mestringsSubjects = await getMestringSubjectList<ISubject[]>();
      setMestringSubjects(mestringsSubjects);
    })();
  }, []);

  const handleAddSubject = (subject: ISubject) => {
    console.log('Add subject');
  };

  const handleAddTheme = (title: string, subjectId: number) => {
    console.log('Add theme');
  };

  const handleRemoveSubject = (id: number) => {
    console.log('Remove subject');
  };

  const handleRemoveTheme = (id: string, subjet: ISubject) => {
    console.log('Remove theme');
  };

  return (
    <div className="admin-subjects">
      {leksehjelpSubjects && leksehjelpSubjects.length > 0 && (
        <AdminSubjectsComponent
          isLeksehjelp={true}
          subjects={leksehjelpSubjects}
          onAddSubject={handleAddSubject}
          onRemoveSubject={handleRemoveSubject}
          onAddTheme={handleAddTheme}
          onRemoveTheme={handleRemoveTheme}
        />
      )}
      <AdminSubjectsComponent
        isLeksehjelp={false}
        subjects={mestringSubjects}
        onAddSubject={handleAddSubject}
        onRemoveSubject={handleRemoveSubject}
        onAddTheme={handleAddTheme}
        onRemoveTheme={handleRemoveTheme}
      />
    </div>
  );
};

export default AdminSubjectsContainer;
