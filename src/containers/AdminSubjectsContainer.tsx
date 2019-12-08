import React, { useEffect, useState } from 'react';
import {
  deleteSubject,
  deleteTheme,
  getMestringSubjectList,
  getSubjectList,
  postSubject,
  postTheme,
} from '../services';
import { ISubject } from '../interfaces';
import AdminSubjectsComponent from '../components/AdminSubjectsComponent';
import '../styles/admin-subjects.less';

const AdminSubjectsContainer = () => {
  const [leksehjelpSubjects, setLeksehjelpSubjects] = useState<ISubject[]>([]);
  const [mestringSubjects, setMestringSubjects] = useState<ISubject[]>([]);
  const [leksehjelpSubjectsUpdated, setLeksehjelpSubjectsUpdated] = useState(
    false,
  );
  const [mestringSubjectsUpdated, setMestringSubjectsUpdated] = useState(false);

  useEffect(() => {
    (async () => {
      const subjects = await getSubjectList<ISubject[]>();
      setLeksehjelpSubjects(subjects);
    })();
  }, [leksehjelpSubjectsUpdated]);

  useEffect(() => {
    (async () => {
      const mestringsSubjects = await getMestringSubjectList<ISubject[]>();
      setMestringSubjects(mestringsSubjects);
    })();
  }, [mestringSubjectsUpdated]);

  const handleTryToUpdate = (isMestring: number) => {
    isMestring === 0
      ? setLeksehjelpSubjectsUpdated(false)
      : setMestringSubjectsUpdated(false);
  };

  const handleUpdated = (isMestring: number) => {
    isMestring === 0
      ? setLeksehjelpSubjectsUpdated(true)
      : setMestringSubjectsUpdated(true);
  };

  const handleAddSubject = async (subjectTitle: string, isMestring: number) => {
    handleTryToUpdate(isMestring);

    const success = await postSubject(subjectTitle, isMestring);
    if (success) {
      handleUpdated(isMestring);
    }
  };

  const handleAddTheme = async (
    title: string,
    subjectId: number,
    isMestring: number,
  ) => {
    handleTryToUpdate(isMestring);

    const success = await postTheme(title, subjectId);
    if (success) {
      handleUpdated(isMestring);
    }
  };

  const handleRemoveSubject = async (id: number, isMestring: number) => {
    handleTryToUpdate(isMestring);

    const success = await deleteSubject(id);
    if (success) {
      handleUpdated(isMestring);
    }
  };

  const handleRemoveTheme = async (id: string, isMestring: number) => {
    handleTryToUpdate(isMestring);

    const success = await deleteTheme(id);
    if (success) {
      handleUpdated(isMestring);
    }
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
