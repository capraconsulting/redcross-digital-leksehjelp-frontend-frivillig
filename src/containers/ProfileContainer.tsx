import React, { useState, useEffect, Fragment } from 'react';
import { getVolunteerSubjectList } from '../services';
import { IVolunteerSubject } from '../interfaces';

const ProfileContainer = () => {
  const [courseList, setCourseList] = useState<IVolunteerSubject[]>([]);
  const [themeList, setThemeList] = useState<IVolunteerSubject[]>([]);

  useEffect(() => {
    getVolunteerSubjectList<IVolunteerSubject[]>().then(data => {
      const themes = data.filter(e => e.isMestring === true);
      const courses = data.filter(e => e.isMestring !== true);
      setCourseList(courses);
      setThemeList(themes);
    });
  }, []);

  return (
    <Fragment>
      <div>
        <h3>Mine fag</h3>
        <div className="sucject--list">
          {courseList.map(({ subject }, id) => (
            <div key={id} className="subject--list-element">
              {subject}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>Mestring og motivasjon</h3>
        <div className="sucject--list">
          {themeList.map(({ subject }, id) => (
            <div key={id} className="subject--list-element">
              {subject}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileContainer;
