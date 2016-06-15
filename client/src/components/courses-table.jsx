import React from 'react';

import CoursesTableRowComponent from './courses-table-row.jsx';

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class CoursesTableComponent extends React.Component {
	render() {
		let courseStatus = {
			'AP': 1, // Aprovado
			'AA': 1, // Aprovado
			'AM': 1, // Aprovado por Media
			'MF': 1, // Aprovado Prova Final
			'DI': 6,
			'DU': 7,
			'RP': 2, // Reprovado
			'TR': 3  // Trancamento
		};

		let completedCoursesAcronyms = [];

		this.props.completedCourses.map(courseDone => {
			completedCoursesAcronyms.push(courseDone.acronym);
		});

		var courseRows = this.props.courses.map((requiredCourse) => {
			let course = requiredCourse;
			let status = 0;

			course.missingPrerequisites = course.prerequisites.diff(completedCoursesAcronyms);

			let indexCourseDone = completedCoursesAcronyms.lastIndexOf(course.acronym);

			if (indexCourseDone === -1) {
				status = course.missingPrerequisites.length ? 5 : 4;
			} else {
				status = courseStatus[this.props.completedCourses[indexCourseDone].status];
			}

			course.status = status;

			return (
				<CoursesTableRowComponent key={course.acronym} course={course}/>
			)
		});

		return (
			<table className="table table-condensed">
				<thead>
				    <tr>
				        <th>Código</th>
				        <th>Nome</th>
				        <th>É prérequisito de</th>
				        <th>Prérequisitos</th>
				        <th>Status</th>
				    </tr>
				</thead>
				<tbody>
					{courseRows}
				</tbody>
			</table>
		)
	}
}

export default CoursesTableComponent;