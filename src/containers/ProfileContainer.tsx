import React, { useState, useEffect, MouseEvent, Fragment } from 'react';

import {
  getVolunteerSubjectList,
  getSubjectList,
  saveSubjects,
  getMestringSubjectList,
  getVolunteerProfile,
  updateProfile,
} from '../services';
import { IVolunteerSubject, ISubject, IProfile } from '../interfaces';
import { Picker, Modal, ProfileForm } from '../components';

interface IOption {
  value: string;
  label: string;
}

const ProfileContainer = () => {
  const [courseList, setCourseList] = useState<IVolunteerSubject[]>([]);
  const [themeList, setThemeList] = useState<IVolunteerSubject[]>([]);
  const [subjectList, setSubjectList] = useState<IOption[]>([]);
  const [mestringSubjectList, setMestringSubjectList] = useState<IOption[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [volunteerProfile, setVolunteerProfile] = useState<IProfile>({
    email: '',
    name: '',
    id: '',
    bioText: '',
  });
  const [isSubjectChanged, setIsSubjectChanged] = useState<boolean>(false);
  const [isProfileChanged, setIsProfileChanged] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const volunteerSubjectList = await getVolunteerSubjectList<
        IVolunteerSubject[]
      >().then(data => {
        const themes = data.filter(e => e.isMestring === true);
        const courses = data.filter(e => e.isMestring === false);
        setCourseList(courses);
        setThemeList(themes);
        return { courses, themes };
      });
      getVolunteerProfile<IProfile>().then(setVolunteerProfile);
      volunteerSubjectList &&
        getSubjectList<ISubject[]>().then(list => {
          const filteredList = list
            .filter(e => {
              const { courses } = volunteerSubjectList;
              if (
                !(
                  courses.filter(course => e.id === Number(course.id)).length >
                  0
                )
              ) {
                return true;
              }
            })
            .map(e => ({ value: e.id.toString(), label: e.subjectTitle }));
          setSubjectList(filteredList);
        });
      volunteerSubjectList &&
        getMestringSubjectList<ISubject[]>().then(list => {
          const filteredMestringList = list
            .filter(e => {
              const { themes } = volunteerSubjectList;
              if (
                !(
                  themes.filter(course => e.subjectTitle === course.subject)
                    .length > 0
                )
              ) {
                return true;
              }
            })
            .map(e => ({ value: e.id.toString(), label: e.subjectTitle }));
          setMestringSubjectList(filteredMestringList);
        });
    })();
  }, []);

  const addSubject = (subject: IOption, type: string): void => {
    const { value, label } = subject;
    if (type === 'fag') {
      const course = { subject: label, id: Number(value), isMestring: false };
      if (!(courseList.filter(e => e.id === Number(value)).length > 0)) {
        setCourseList([...[course], ...courseList]);
      }
      const subjects = subjectList.filter(e => e.value !== subject.value);
      setSubjectList(subjects);
    } else {
      const theme = { subject: label, id: Number(value), isMestring: true };
      if (!(themeList.filter(e => e.id === Number(value)).length > 0)) {
        setThemeList([...[theme], ...themeList]);
      }
      const subjects = mestringSubjectList.filter(
        e => e.value !== subject.value,
      );
      setMestringSubjectList(subjects);
    }
    setIsSubjectChanged(true);
  };

  const removeSubject = (
    item: number,
    subject: string,
    type: string,
    e: MouseEvent,
  ): void => {
    if (type === 'fag') {
      const list = courseList.filter(({ id }) => id !== Number(item));
      setCourseList(list);
      const subjectObj = { label: subject, value: item.toString() };
      setSubjectList([...[subjectObj], ...subjectList]);
    } else {
      const list = themeList.filter(({ id }) => id !== Number(item));
      setThemeList(list);
      const subjectObj = { label: subject, value: item.toString() };
      setMestringSubjectList([...[subjectObj], ...mestringSubjectList]);
    }
    setIsSubjectChanged(true);
    e.preventDefault();
  };

  const onSave = async () => {
    const list = courseList.map(e => e.id).concat(themeList.map(e => e.id));
    let isSubjectUpdateSuccess = false;
    let isProfileUpdateSuccess = false;

    if (isProfileChanged && isSubjectChanged) {
      isProfileUpdateSuccess = await updateProfile(volunteerProfile)
        .then(() => true)
        .catch(() => false);
      isSubjectUpdateSuccess = await saveSubjects(list)
        .then(() => true)
        .catch(() => false);
    } else if (isSubjectChanged) {
      isSubjectUpdateSuccess = await saveSubjects(list)
        .then(() => true)
        .catch(() => false);
    } else if (isProfileChanged) {
      isProfileUpdateSuccess = await updateProfile(volunteerProfile)
        .then(() => true)
        .catch(() => false);
    }

    if (
      (isProfileChanged && isProfileUpdateSuccess) ||
      (isSubjectChanged && isSubjectUpdateSuccess)
    ) {
      setModalText('Profilen din er oppdatert!');
      setModalOpen(true);
    } else if (
      (isProfileChanged && !isProfileUpdateSuccess) ||
      (isSubjectChanged && !isSubjectUpdateSuccess)
    ) {
      setModalText('Ops! Noe gikk galt.');
      setModalOpen(true);
    } else {
      setModalText('Ingenting å oppdatere...');
      setModalOpen(true);
    }
    setIsSubjectChanged(false);
    setIsProfileChanged(false);
  };

  return (
    <Fragment>
      {modalOpen && (
        <Modal
          content={modalText}
          closingCallback={() => setModalOpen(false)}
        />
      )}
      <div className="profile--container">
        <Picker
          title="Mine fag"
          type="fag"
          placeholder="Legg til fag"
          optionList={subjectList}
          addSubject={addSubject}
          selectedList={courseList}
          removeSubject={removeSubject}
        />
        <Picker
          title="Mestring og motivasjon"
          type="mestring"
          placeholder="Legg til tema"
          optionList={mestringSubjectList}
          addSubject={addSubject}
          selectedList={themeList}
          removeSubject={removeSubject}
        />
        <ProfileForm
          profile={volunteerProfile}
          setProfile={setVolunteerProfile}
          isChanged={setIsProfileChanged}
          title="Personlig info"
        />
        <div className="profile--footer">
          <button className="leksehjelp--button-success" onClick={onSave}>
            Lagre
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileContainer;
