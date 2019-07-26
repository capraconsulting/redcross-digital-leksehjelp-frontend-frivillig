import React, { useState, useEffect, Fragment } from 'react';
import Dropdown from 'react-dropdown';
import { getVolunteerSubjectList, getSubjectList, saveSubjects } from '../services';
import { IVolunteerSubject, ISubject } from '../interfaces';
import Cross from '../assets/Cross';

interface IOptions {
  value: string;
  label: string;
}

const ProfileContainer = () => {
  const [courseList, setCourseList] = useState<IVolunteerSubject[]>([]);
  const [themeList, setThemeList] = useState<IVolunteerSubject[]>([]);
  const [subjectList, setSubjectList] = useState<IOptions[]>([]);

  useEffect(() => {(async () => {
    const wait = await getVolunteerSubjectList<IVolunteerSubject[]>().then(data => {
      const themes = data.filter(e => e.isMestring === 1);
      const courses = data.filter(e => e.isMestring !== 1);
      setCourseList(courses);
      setThemeList(themes);
      return {courses, themes}
    });
    wait && getSubjectList<ISubject[]>().then((list) => {
      const filteredList = list.filter((e) => {
        const { courses } = wait;
        if (!(courses.filter((course) => e.id === Number(course.id)).length > 0)) {
          return true
        }
      }).map(e => ({ value: e.id.toString(), label: e.subjectTitle }))
      setSubjectList(filteredList)
    });
  })();}, []);

  const addSubject = (subject, type):void => {
    const {value, label} = subject
    if (type === "fag") {
      const course = {subject: label, id: Number(value), isMestring: 0}
      if (!(courseList.filter(e => e.id === Number(value)).length > 0)) {
        setCourseList([...[course], ...courseList])
      }
    } else {
      const theme = {subject: label, id: Number(value), isMestring: 0}
      if (!(themeList.filter(e => e.id === Number(value)).length > 0)) {
        setCourseList([...[theme], ...courseList])
      }
    }
    console.log(subject)
    const subjects = subjectList.filter(e => e.value !== subject.value)
    setSubjectList(subjects)
  }

  const removeSubject = (item: number, subject: string, type: string, e) => {
    if (type === "fag") {
      const list = courseList.filter(({id}) => id !== Number(item))
      setCourseList(list)
      const subjectObj = {label: subject, value: item.toString()}
      setSubjectList([...[subjectObj],...subjectList])
    } else {
      const list = themeList.filter(({id}) => id !== Number(item))
      setThemeList(list)
      const subjectObj = {label: subject, value: item.toString()}
      setSubjectList([...[subjectObj],...subjectList])
    }
    e.preventDefault();
  }

  const onSave = ():void => {
    const list = courseList.map((e) => e.id).concat(themeList.map((e) => e.id))
    saveSubjects(list)
  }

  return (
    <div className="profile--container">
      <div className="profile--component">
        <h3>Mine fag</h3>
        <Dropdown className="subject--dropdown" options={subjectList} onChange={(e) => addSubject(e, "fag")} placeholder="Legg til fag"/>
        <div className="subject--list">
          {courseList.map(({ subject, id }, index) => (
            <div key={index} className="subject--list-element">
              <p>{subject}</p>
              <button className="leksehjelp--button-close" onClick={(e) => removeSubject(id, subject, "fag", e)}><Cross color="#8b51c6"/></button>
            </div>
          ))}
        </div>
      </div>
      <div className="profile--component">
        <h3>Mestring og motivasjon</h3>
        <Dropdown className="subject--dropdown" options={subjectList} onChange={(e) => addSubject(e, "mestring")} placeholder="Legg til tema"/>
        <div className="subject--list">
          {themeList.map(({ subject, id }, index) => (
            <div key={index} className="subject--list-element">
              <p>{subject}</p>
              <button className="leksehjelp--button-close" onClick={(e) => removeSubject(id, subject, "mestring", e)}><Cross color="#8b51c6"/></button>
            </div>
          ))}
        </div>
      </div>
      <div className="profile--footer">
        <button className="leksehjelp--button-success" onClick={onSave}>Lagre</button>
      </div>
    </div>
  );
};

export default ProfileContainer;
