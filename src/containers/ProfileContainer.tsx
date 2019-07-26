import React, { useState, useEffect, Fragment } from 'react';
import Dropdown from 'react-dropdown';
import { getVolunteerSubjectList, getSubjectList } from '../services';
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
      }).map(e => ({ label: e.subjectTitle, value: e.id.toString() }))
      setSubjectList(filteredList)
    });
  })();}, []);

  const addSubject = (subject):void => {
    const {value, label} = subject
    const course = {subject: label, id: Number(value), isMestring: 0}
    if (!(courseList.filter(e => e.id === Number(value)).length > 0)) {
      setCourseList([...[course], ...courseList])
    }
    const subjects = subjectList.filter(e => e === subject)
    setSubjectList(subjects)
  }

  const removeSubject = (item: number, subject: string, e) => {
    const list = courseList.filter(({id}) => id !== Number(item))
    setCourseList(list)
    const subjectObj = {label: subject, value: item.toString()}
    setSubjectList([...[subjectObj],...subjectList])
    e.preventDefault();
  }

  return (
    <div className="profile--container">
      <div className="profile--component">
        <h3>Mine fag</h3>
        <Dropdown className="subject--dropdown" options={subjectList} onChange={addSubject} placeholder="Legg til fag"/>
        <div className="subject--list">
          {courseList.map(({ subject, id }, index) => (
            <div key={index} className="subject--list-element">
              <p>{subject}</p>
              <button className="leksehjelp--button-close" onClick={(e) => removeSubject(id, subject, e)}><Cross color="#8b51c6"/></button>
            </div>
          ))}
        </div>
      </div>
      <div className="profile--component">
        <h3>Mestring og motivasjon</h3>
        <Dropdown className="subject--dropdown" options={subjectList} onChange={addSubject} placeholder="Legg til tema"/>
        <div className="subject--list">
          {themeList.map(({ subject, id }, index) => (
            <div key={index} className="subject--list-element">
              <p>{subject}</p>
              <button className="leksehjelp--button-close" onClick={(e) => removeSubject(id, subject, e)}><Cross color="#8b51c6"/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
