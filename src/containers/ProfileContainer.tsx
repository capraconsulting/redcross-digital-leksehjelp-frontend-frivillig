import React, {
  useState,
  useEffect,
  MouseEvent,
  Fragment,
  useContext,
} from 'react';

import {
  getVolunteerSubjectList,
  getSubjectList,
  saveSubjects,
  getMestringSubjectList,
  updateProfile,
  getVolunteer,
  createVolunteerMessage,
} from '../services';
import { IVolunteerSubject } from '../interfaces';
import { Picker, Modal, ProfileForm } from '../components';
import { SocketContext } from '../providers';

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
  const [isSubjectChanged, setIsSubjectChanged] = useState<boolean>(false);
  const [isProfileChanged, setIsProfileChanged] = useState<boolean>(false);
  const { socketSend, setVolunteerInfo, volunteerInfo } = useContext(
    SocketContext,
  );

  useEffect(() => {
    (async () => {
      const volunteerSubjectList = await getVolunteerSubjectList().then(
        data => {
          const themes = data.filter(e => e.isMestring);
          const courses = data.filter(e => !e.isMestring);
          setCourseList(courses);
          setThemeList(themes);
          return { courses, themes };
        },
      );
      volunteerSubjectList &&
        getSubjectList().then(list => {
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
        getMestringSubjectList().then(list => {
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
    const isProfileUpdateSuccess =
      isProfileChanged &&
      (await updateProfile(volunteerInfo)
        .then(() => true)
        .catch(() => false));

    const isSubjectUpdateSuccess =
      isSubjectChanged &&
      (await saveSubjects(list)
        .then(() => true)
        .catch(() => false));

    if (isProfileUpdateSuccess || isSubjectUpdateSuccess) {
      const volunteerInfo = await getVolunteer();
      setVolunteerInfo(volunteerInfo);
      socketSend(createVolunteerMessage(volunteerInfo));
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
      <div className="side-margin">
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
          <ProfileForm isChanged={setIsProfileChanged} title="Personlig info" />
          <div className="profile--footer">
            <button className="leksehjelp--button-success" onClick={onSave}>
              Lagre
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileContainer;
