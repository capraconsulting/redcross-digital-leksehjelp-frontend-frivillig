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
  getVolunteerProfile,
} from '../services';
import { IVolunteerSubject, ISubject, IProfile } from '../interfaces';
import { Picker, Modal } from '../components';

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

  useEffect(() => {
    (async () => {
      const volunteerSubjectList = await getVolunteerSubjectList<
        IVolunteerSubject[]
      >().then(data => {
        const themes = data.filter(e => e.isMestring === 1);
        const courses = data.filter(e => e.isMestring !== 1);
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
          const filteredList = list
            .filter(e => {
              const { themes } = volunteerSubjectList;
              if (
                !(
                  themes.filter(course => e.id === Number(course.id)).length > 0
                )
              ) {
                return true;
              }
            })
            .map(e => ({ value: e.id.toString(), label: e.subjectTitle }));
          setMestringSubjectList(filteredList);
        });
    })();
  }, []);

  const addSubject = (subject: IOption, type: string): void => {
    const { value, label } = subject;
    if (type === 'fag') {
      const course = { subject: label, id: Number(value), isMestring: 0 };
      if (!(courseList.filter(e => e.id === Number(value)).length > 0)) {
        setCourseList([...[course], ...courseList]);
      }
      const subjects = subjectList.filter(e => e.value !== subject.value);
      setSubjectList(subjects);
    } else {
      const theme = { subject: label, id: Number(value), isMestring: 0 };
      if (!(themeList.filter(e => e.id === Number(value)).length > 0)) {
        setThemeList([...[theme], ...themeList]);
      }
      const subjects = mestringSubjectList.filter(
        e => e.value !== subject.value,
      );
      setMestringSubjectList(subjects);
    }
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
      setMestringSubjectList([...[subjectObj], ...subjectList]);
    }
    e.preventDefault();
  };

  const onSave = (): void => {
    const list = courseList.map(e => e.id).concat(themeList.map(e => e.id));
    saveSubjects(list)
      .then(() => {
        setModalText('Dine kunnskaper er oppdatert!');
        setModalOpen(true);
      })
      .catch(() => {
        setModalText('Noe gikk galt. Vi klarte ikke oppdatere dine kunnskaper');
        setModalOpen(true);
      });
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
        <div className="profile--footer">
          <button className="leksehjelp--button-success" onClick={onSave}>
            Lagre
          </button>
        </div>
        <div>
          <p>{volunteerProfile.name}</p>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileContainer;
