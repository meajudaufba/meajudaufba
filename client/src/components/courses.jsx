import React from 'react';

import CoursesTableComponent from './courses-table.jsx';

class CoursesComponent extends React.Component {
	render() {
		return (
			<div>
				<h4>Matérias obrigatórias:</h4>
				
				<div>
					<CoursesTableComponent courses={this.props.courses} completedCourses={this.props.completedCourses} />
				</div>
			</div>
		)
	}
}

export default CoursesComponent;