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
  const [updatedSubjects, setUpdatedSubjects] = useState(false);
  const [updatedMestringSubjects, setUpdatedMestringSubjects] = useState(false);

  useEffect(() => {
    (async () => {
      const subjects = await getSubjectList<ISubject[]>();
      setLeksehjelpSubjects(subjects);
    })();
  }, [updatedSubjects]);

  useEffect(() => {
    (async () => {
      const mestringsSubjects = await getMestringSubjectList<ISubject[]>();
      setMestringSubjects(mestringsSubjects);
    })();
  }, [updatedMestringSubjects]);

  const handleAddSubject = async (subjectTitle: string, isMestring: number) => {
    const success = await postSubject(subjectTitle, isMestring);
    if (success) {
      if (isMestring) {
        setMestringSubjects(await getMestringSubjectList());
        setUpdatedMestringSubjects(true);
      } else {
        setLeksehjelpSubjects(await getSubjectList());
        setUpdatedSubjects(true);
      }
    }
  };

  const handleAddTheme = async (
    title: string,
    subjectId: number,
    isMestring: number,
  ) => {
    const success = await postTheme(title, subjectId);
    if (success) {
      if (isMestring) {
        setMestringSubjects(await getMestringSubjectList());
        setUpdatedMestringSubjects(true);
      } else {
        setLeksehjelpSubjects(await getSubjectList());
        setUpdatedSubjects(true);
      }
    }
  };

  const handleRemoveSubject = async (id: number, isMestring: number) => {
    const success = await deleteSubject(id);
    if (success) {
      if (isMestring) {
        setMestringSubjects(await getMestringSubjectList());
        setUpdatedMestringSubjects(true);
      } else {
        setLeksehjelpSubjects(await getSubjectList());
        setUpdatedSubjects(true);
      }
    }
  };

  const handleRemoveTheme = async (id: string, isMestring: number) => {
    const success = await deleteTheme(id);
    if (success) {
      if (isMestring) {
        setMestringSubjects(await getMestringSubjectList());
        setUpdatedMestringSubjects(true);
      } else {
        setLeksehjelpSubjects(await getSubjectList());
        setUpdatedSubjects(true);
      }
    }
  };

  return (
    <div className="admin-subjects">
      <AdminSubjectsComponent
        isLeksehjelp={true}
        subjects={leksehjelpSubjects}
        onAddSubject={handleAddSubject}
        onRemoveSubject={handleRemoveSubject}
        onAddTheme={handleAddTheme}
        onRemoveTheme={handleRemoveTheme}
      />
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
