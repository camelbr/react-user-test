import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { login } from "../acoes/usuarioAcoes";
import { connect } from "react-redux";
import '../css/Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      erros: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Clico de vida das propriedades do Redux (capturando os erros de validação)
  componentWillReceiveProps(novoProps) {
    if (novoProps.erros) {
      this.setState({ erros: novoProps.erros });
    }
  }

  // Atualizando no change para sempre manter o state atualizado
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const usuario = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.login(usuario, this.props.history);
  }

  render() {
    const { erros } = this.state;
    return (
          <div className="Container">
            <div className="Divlogin">
              <form onSubmit={this.onSubmit}>
                <div className="card bg-light">
                  <div className="card-header mb-4 text-primary text-center">
                    <h4>Please login</h4>
                  </div>
                  <div className="form-group mb-2 col-md-12">
                    <input
                      id="inputEmail"
                      type="email"
                      className={classnames("form-control", {
                        "is-invalid": erros.email
                      })}
                      name="email"
                      value={this.state.email}
                      aria-describedby="emailHelp"
                      placeholder="Email Address"
                      onChange={this.onChange}
                    />
                    {erros.email && (
                      <span className="invalid-feedback">{erros.email}</span>
                    )}
                  </div>
                  <div className="form-group col-md-12">
                    <input
                      id="inputPassword"
                      type="password"
                      className={classnames("form-control", {
                        "is-invalid": erros.password
                      })}
                      name="password"
                      value={this.state.password}
                      placeholder="Password"
                      onChange={this.onChange}
                    />
                    {erros.password && (
                      <span className="invalid-feedback">{erros.password}</span>
                    )}
                  </div>
                  <div className="text-center mb-2">
                    <div className="form-group">
                      {erros.invalidUser && (
                        <span className="text-danger">
                          {erros.invalidUser}
                        </span>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary ">
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  usuario: PropTypes.object.isRequired,
  erros: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  usuario: state.usuario.usuario,
  erros: state.erros
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
