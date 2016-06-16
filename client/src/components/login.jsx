import React from 'react';
import { withRouter } from 'react-router';

import Auth from '../services/auth.jsx';

class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			submiting: false,
			error: false
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	authenticateUser(formData) {
		this.setState({
			submiting: true
		});

		Auth.login(formData.cpf, formData.password, res => {
			this.setState({
				submiting: false,
				error: !res
			});

			if (res) {				
				const { location } = this.props;

				if (location.state && location.state.nextPathname) {
					this.props.router.replace(location.state.nextPathname)
				} else {
					this.props.router.replace('/disciplinas')
				}
			}
		});
	}

	onSubmit(event) {
		event.preventDefault();		

		this.authenticateUser({
			cpf: event.target.inputCPF.value,
			password: event.target.inputPassword.value
		});
	}

	render () {
	    return (
	    	<div id="container-login" className="container">
			    <form id="login-form" onSubmit={this.onSubmit.bind(this)} className="form-signin">
			        <h2 className="form-signin-heading">Me ajuda, UFBA!</h2>					
					
			        <div className="alert alert-info">
						<button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
						<p>
							Esta aplicação não armazena <b>NENHUM</b> dado sobre sua conta.
						</p>
			        </div>

			        {this.state.error && (
			        	<div className="alert alert-danger alert-dismissible fade in">
						    <p>
						        CPF ou senha inválidos.
						    </p>
						</div>

			        )}

			        <label for="inputCPF" className="sr-only">CPF</label>
			        <input type="text" id="inputCPF" className="form-control" placeholder="Seu CPF" required autofocus />
			       
			       <label for="inputPassword" className="sr-only">Senha</label>
			        <input type="password" id="inputPassword" className="form-control" placeholder="Sua senha do Siac" required />
			        
			        <button id="submit-button" className="btn btn-lg btn-primary btn-block" type="submit">
			        	{this.state.submiting ? 'Verificando...' : 'Entrar'}
			        </button>

			        <p className="footer-login">
			        	Desenvolvido por <a href="https://github.com/dygufa" target="_blank">@dygufa</a> e 
			        	<a href="https://github.com/Eowfenth" target="_blank">@Eowfenth</a>
			        </p>
			    </form>
			</div>
	    )
	}
}

export default withRouter(LoginComponent);