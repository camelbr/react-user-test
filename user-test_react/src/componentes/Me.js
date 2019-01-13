import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Me extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      dateCreation: "",
      lastLogin: "",
      erros: {}
    };
  }

  setUserInState(user) {
    const { id, firstName, lastName, email, dateCreation, lastLogin } = user;
    this.setState({ id, firstName, lastName, email, dateCreation, lastLogin });
  }

  removerSession() {
    sessionStorage.removeItem("sessionUser");
  }

  // Clico de vida das propriedades do Redux (capturando os erros de validação)
  componentWillReceiveProps(novoProps) {
    if (novoProps.erros) {
      this.setState({ erros: novoProps.erros });
    }

    if (novoProps.usuario !== null && novoProps.usuario.id) {
      this.setUserInState(novoProps.usuario);
      sessionStorage.setItem("sessionUser", JSON.stringify(novoProps.usuario));
    }
  }

  componentDidMount() {
    var sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"));
    // recuperando dados salvos na sessão
    if (sessionUser !== null && sessionUser.id) {
      this.setUserInState(sessionUser);
    }
  }

  render() {
    const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"));

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
                <h6 className="bg-secondary text-white">Phones</h6>
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
    if (sessionUser !== null) {
      phonesTable = getUserPhones(sessionUser.phones);
    }

    return (
      <div className="container">
        {!sessionUser ? (
          <div className="col-md-12 m-auto">
            <h4 className="display-5 text-center alert alert-danger">
              Unauthorized! Please{" "}
              <Link to="/signin" className="text-secondary">
                {" "}
                Sing Up{" "}
              </Link>
            </h4>
          </div>
        ) : (
          <div>
            <div className="float-right" title="Logout">
              <a
                href="/signin"
                onClick={() => this.removerSession()}
                className="btn btn-danger btn-sm"
              >
                <i className="fas fa-sign-out-alt" />
              </a>
            </div>
            <br />
            <br />
            <h3 className="bg-info text-white">User data</h3>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <label>
                  <strong>First Name: </strong>
                </label>
                <span> {this.state.firstName}</span>
              </div>
              <div className="col-md-4">
                <label>
                  <strong>Last Name: </strong>
                </label>
                <span> {this.state.lastName}</span>
              </div>
              <div className="col-md-4">
                <label>
                  <strong>E-mail: </strong>
                </label>
                <span> {this.state.email}</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <label>
                  <strong>Date of creation : </strong>
                </label>
                <span> {this.state.dateCreation}</span>
              </div>
              <div className="col-md-4">
                <label>
                  <strong>Last login date : </strong>
                </label>
                <span> {this.state.lastLogin}</span>
              </div>
            </div>

            <hr />
            {phonesTable}
          </div>
        )}
      </div>
    );
  }
}

Me.propTypes = {
  usuario: PropTypes.object.isRequired,
  erros: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  usuario: state.usuario.usuario,
  erros: state.erros
});

export default connect(mapStateToProps)(Me);
