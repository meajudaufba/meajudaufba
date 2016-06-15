import React from 'react';
import Auth from '../services/auth.jsx';

class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			completedCourses: []
		};
	}

	loadCoursesFromServer() {
		let  token = Auth.getToken();

		$.ajax({
			type: 'get',
			url: '/api/me',
			headers: {'x-access-token': token},
			success: (res) => {
				if (res.success) {
					this.setState({
						courses: res.courses,
						completedCourses: res.completedCourses
					});
				} else if (res.code == 2001) {
					Auth.logout();
					this.props.router.replace('/login');
				}
			},
			error: (xhr, status, err) => {
				console.error(this.props.url, status, err.toString());
			}
		});
	}

	componentDidMount() {
		this.loadCoursesFromServer();
	}

	render() {
		return (
			<div>
				{this.props.children && React.cloneElement(this.props.children, {
					courses: this.state.courses,
					completedCourses: this.state.completedCourses
				})}
			</div>
		)
	}
}



export default AppComponent;