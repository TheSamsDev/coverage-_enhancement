import React, { Component } from "react";

import { connect } from "react-redux";

import { Link, useLocation } from "react-router-dom";

// reactstrap
import {
  Collapse,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

// Import menuDropdown

import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

//Import Logos
import logoSmLight from "../../assets/images/favcion.png";
import logoLight from "../../assets/images/favcion.png";
import logoDark from "../../assets/images/favcion.png";
import logoSmDark from "../../assets/images/favcion.png";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";

const withLocation = (Component) => (props) => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};

class Header extends Component {
  isActive = (path) => {
    return this.props.location.pathname === path ? "active" : "";
  };
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      isMegaMenu: false,
      isProfile: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleRightbar = this.toggleRightbar.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }
//   ("Header");

  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };
  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.openLeftMenuCallBack();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSmDark} alt="" height="49" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="49" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSmLight} alt="" height="49" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="49" />
                  </span>
                </Link>
              </div>
            </div>

            <div>
            <nav
                className="navbar navbar-light navbar-expand-lg topnav-menu"
                id="navigation"
              >
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className={`nav-link ${this.isActive("/dashboard")}`} to="/dashboard">
                        <i className="ri-dashboard-line me-2"></i>
                        {this.props.t("Dashboard")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/coverage-enhancement" className={`nav-link ${this.isActive("/coverage-enhancement")}`}>
                        <i className="ri-line-chart-line me-2"></i>
                        {this.props.t("Coverage Enhancement")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/sales-analytics" className={`nav-link ${this.isActive("/sales-analytics")}`}>
                        <i className="ri-bar-chart-2-line me-2"></i>
                        {this.props.t("Sales Analytics")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/stores" className={`nav-link ${this.isActive("/stores")}`}>
                        <i className="ri-store-2-line me-2"></i>
                        {this.props.t("Stores")}
                      </Link>
                    </li>
                  </ul>
                </Collapse>
              </nav>
            </div>

            <div className="d-flex">
              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { layoutType } = state.Layout;
  return { layoutType };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(
  withTranslation()(withLocation(Header))
);
