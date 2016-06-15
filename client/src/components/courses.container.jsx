import React from 'react';

import CourseComponent from './courses.jsx';

class CoursesContainerComponent extends React.Component {
	render () {
		return <CourseComponent courses={this.props.courses} completedCourses={this.props.completedCourses}/>;
	}
}

export default CoursesContainerComponent;