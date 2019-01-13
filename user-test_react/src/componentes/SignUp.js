import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addUser } from "../acoes/usuarioAcoes";
import PropTypes from "prop-types";
import classnames from "classnames";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      countryCode: "",
      areaCode: "",
      number: "",
      phones: [],
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

    if (novoProps.usuario.id) {
      const { id, firstName, lastName, email, password } = novoProps.usuario;
      this.setState({ id, firstName, lastName, email, password });
    }
  }

  // Atualizando no change para sempre manter o state atualizado
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const usuario = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      phones: this.state.phones
    };
    this.props.addUser(usuario, this.props.history);
  }

  addPhone() {
    var newPhone = {};
    newPhone.countryCode = this.state.countryCode;
    newPhone.areaCode = this.state.areaCode;
    newPhone.number = this.state.number;

    if (newPhone.countryCode && newPhone.areaCode && newPhone.areaCode) {
      var phones = this.state.phones;

      if (phones !== null && phones.length > 0) {
        var exist = false;

        phones.forEach(phone => {
          if (
            phone.countryCode === newPhone.countryCode &&
            phone.areaCode === newPhone.areaCode &&
            phone.number === newPhone.number
          ) {
            exist = true;
          }
        });
      }

      if (!exist) {
        phones.push(newPhone);

        this.setState({
          phones: phones,
          countryCode: "",
          areaCode: "",
          number: "",
          erros: {}
        });
      }
    }
  }

  render() {
    const getUserPhones = phones => {
      if (phones.length < 1) {
        return (
          <div className="alert alert-info text-center" role="alert">
            There are no registered phones
          </div>
        );
      } else {
        return (
          <React.Fragment>
            <div className="row">
              <div className="col-md-12">
                <div
                  id="phoneTable"
                  className="table-responsive col-md-10 float-right"
                >
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "30%" }}>Country Code</th>
                        <th style={{ width: "30%" }}>Area Code</th>
                        <th style={{ width: "40%" }}>Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phones.map((phone, index) => {
                        return (
                          <tr key={index}>
                            <td>{phone.countryCode}</td>
                            <td>{phone.areaCode}</td>
                            <td>{phone.number}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }
    };

    var phonesTable = null;
    if (this.state.phones !== null) {
      phonesTable = getUserPhones(this.state.phones);
    }

    const { erros } = this.state;

    const user = this.props.usuario;

    return (
      <div className="addUser">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              {user && user.id && (
                <div className="alert alert-success">
                  <strong>Success!</strong> The user <strong><i>{user.firstName}</i></strong> created.
                </div>
              )}
              <h4 className="display-5 text-center alert alert-secondary">
                Sing Up
              </h4>
              <form onSubmit={this.onSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>First Name</label>
                    <input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": erros.firstName
                      })}
                      name="firstName"
                      value={this.state.firstName}
                      aria-describedby="emailHelp"
                      placeholder="Your first name"
                      onChange={this.onChange}
                    />
                    {erros.firstName && (
                      <span className="invalid-feedback">
                        {erros.firstName}
                      </span>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": erros.lastName
                      })}
                      name="lastName"
                      value={this.state.lastName}
                      placeholder="Your last name"
                      onChange={this.onChange}
                    />
                    {erros.lastName && (
                      <span className="invalid-feedback">{erros.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label>E-mail</label>
                    <input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": erros.email
                      })}
                      name="email"
                      value={this.state.email}
                      placeholder="E-mail address"
                      onChange={this.onChange}
                    />
                    {erros.email && (
                      <span className="invalid-feedback">{erros.email}</span>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label>Password</label>
                    <input
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
                </div>

                <h6 className="bg-secondary text-white">Phones</h6>
                <div className="row">
                  <div className="form-group col-md-3">
                    <label>Country code</label>
                    <input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": erros.countryCode
                      })}
                      name="countryCode"
                      value={this.state.countryCode}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label>Area code</label>
                    <input
                      type="number"
                      className={classnames("form-control", {
                        "is-invalid": erros.areaCode
                      })}
                      name="areaCode"
                      value={this.state.areaCode}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label>Number</label>
                    <input
                      type="number"
                      className={classnames("form-control", {
                        "is-invalid": erros.number
                      })}
                      name="number"
                      value={this.state.number}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="col-md-3 d-flex align-self-center">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => this.addPhone()}
                    >
                      <i className="fa fa-plus" />
                      Add phone
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    {erros.invalidPhones && (
                      <span className="text-danger">{erros.invalidPhones}</span>
                    )}
                  </div>
                </div>

                {phonesTable}

                <div className="text-center">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100px" }}
                  />
                  &ensp;
                  <Link
                    to="/signin"
                    className="btn btn-danger"
                    style={{ width: "100px" }}
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  addUser: PropTypes.func.isRequired,
  // consultarUsuario: PropTypes.func.isRequired,
  usuario: PropTypes.object.isRequired,
  erros: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  usuario: state.usuario.usuario,
  erros: state.erros
});

export default connect(
  mapStateToProps,
  { addUser }
)(SignUp);
