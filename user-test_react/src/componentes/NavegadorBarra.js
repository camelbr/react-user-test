import React from "react";

export default function NavegadorBarra() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
      <div className="container">
        <span className="navbar-brand">
          Processo Pitang
        </span>
        <div className="pull-left" title="Ínicio">
          <a href="/" className="btn btn-primary">
            <i className="fa fa-home" />
          </a>
        </div>
      </div>
    </nav>
  );
}
