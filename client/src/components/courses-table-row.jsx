import React from 'react';

class CoursesTableRowComponent extends React.Component {
	render() {
		var statusTo = {
			1: {className: 'success', description: 'Cursou e foi aprovado'},
			2: {className: 'danger', description: 'Cursou e foi reprovado'},
			3: {className: '', description: 'Cursou e trancou'},
			4: {className: '', description: 'Não cursada'},
			5: {className: 'warning', description: 'Precisa cursar prérequisitos'},
			6: {className: 'success', description: 'Dispensado'},
			7: {className: 'success', description: 'Dispensado'}
		};

		let course = this.props.course;

		let prerequisitesLength = course.prerequisites.length;
		let prerequisites = course.prerequisites.map((prerequisite, index) => {
			return (
				<span className={course.missingPrerequisites.indexOf(prerequisite) !== -1 ? 'missing-prerequisite' : ''} key={index}>
					{prerequisite}
					{index < prerequisitesLength - 1 ? ', ' : ''}
				</span>
			)
		});

		let prerequisiteOfLength = course.prerequisiteOf.length;
		let prerequisiteOf = course.prerequisiteOf.map((prerequisite, index) => {
			return (
				<span key={index}>
					{prerequisite}
					{index < prerequisiteOfLength - 1 ? ', ' : ''}
				</span>
			)
		});

		return (
			<tr className={statusTo[course.status].className}>
				<td>{course.acronym}</td>
				<td>{course.name}</td>
				<td>{prerequisiteOf}</td>
				<td>{prerequisites}</td>
				<td>{statusTo[course.status].description}</td>
			</tr>
		)
	}
}

export default CoursesTableRowComponent;