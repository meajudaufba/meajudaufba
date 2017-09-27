import React from 'react';
import findLast from "lodash/findLast";

import CoursesTableRowComponent from './courses-table-row.jsx';

Array.prototype.diff = function(a) {
    return this.filter(function(i) {
		return a.indexOf(i) < 0;
	});
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


		let completedCoursesAcronyms = this.props.completedCourses
		.filter(course => {
			return ['AP', 'AA', 'AM', 'MF'].indexOf(course.status) !== -1
		})
		.map(courseDone => {
			return courseDone.acronym;
		});

		var courseRows = this.props.courses.map((course) => {
			let status = 0;
			course.missingPrerequisites = course.prerequisites.filter(x => completedCoursesAcronyms.indexOf(x) === -1);

			let completedCourse = findLast(this.props.completedCourses, c => c.acronym === course.acronym);

			if (!completedCourse) {
				status = course.missingPrerequisites.length ? 5 : 4;
			} else if (courseStatus[completedCourse.status]) {
				status = courseStatus[completedCourse.status];
			} else if (completedCourse.status == '--' && completedCourse.nt != '--') {
				status = 8; // Currently enrolled
			} else {
				console.log('Unknown status: ' + completedCourse);
				status = 9; // Unknown status
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