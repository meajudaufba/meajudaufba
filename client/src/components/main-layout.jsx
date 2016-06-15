import React from 'react';

class MainLayoutComponent extends React.Component {
  render () {
    return (
    	<div className="container">
			<div className="page-header">
				<h1>Me ajuda, UFBA!</h1>
			</div>

			<div>
				{this.props.children && React.cloneElement(this.props.children, {
					courses: this.props.courses,
					completedCourses: this.props.completedCourses
				})}
			</div>

			<div className="footer">Desenvolvido por <a href="https://github.com/dygufa" target="_blank">@dygufa</a> e <a href="https://github.com/Eowfenth" target="_blank">@Eowfenth</a>. Manda um email pra hello@dygufa.com se você achar algum bug. :)</div>
		</div>
    )
  }
}

export default MainLayoutComponent;