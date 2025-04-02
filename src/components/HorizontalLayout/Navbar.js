import React, { Component } from "react";
import { Collapse, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';
import withRouter from "../Common/withRouter";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({});
        }
    }

    componentDidMount() {
        var matchingMenuItem = null;
        var ul = document.getElementById("navigation");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.router.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }

    activateParentDropdown = item => {
        item.classList.add("active");
        const parent = item.parentElement;
        if (parent) {
            parent.classList.add("active");
            const parent2 = parent.parentElement;
            parent2.classList.add("active");
            const parent3 = parent2.parentElement;
            if (parent3) {
                parent3.classList.add("active");
                const parent4 = parent3.parentElement;
                if (parent4) {
                    parent4.classList.add("active");
                    const parent5 = parent4.parentElement;
                    if (parent5) {
                        parent5.classList.add("active");
                        const parent6 = parent5.parentElement;
                        if (parent6) {
                            parent6.classList.add("active");
                        }
                    }
                }
            }
        }
        return false;
    };

    render() {
        return (
            <React.Fragment>
                <div className="topnav mystical-navbar">
                    <Container fluid>
                        <nav className="navbar navbar-expand-lg topnav-menu" id="navigation">
                            <Collapse isOpen={this.props.menuOpen} className="navbar-collapse">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="nav-link nav-3d" to="/">
                                            <i className="ri-dashboard-line me-2"></i>
                                            <span>{this.props.t('Dashboard')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/coverage-enhancement" className="nav-link nav-3d">
                                            <i className="ri-signal-tower-line me-2"></i>
                                            <span>{this.props.t('Coverage Enhancement')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/coverage-enhancement" className="nav-link nav-3d">
                                            <i className="ri-pie-chart-box-line me-2"></i>
                                            <span>{this.props.t('Sales Analytics')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/coverage-enhancement" className="nav-link nav-3d">
                                            <i className="ri-store-2-line me-2"></i>
                                            <span>{this.props.t('Stores')}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </Collapse>
                        </nav>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { leftSideBarType, leftSideBarTheme } = state.Layout;
    return { leftSideBarType, leftSideBarTheme };
}

export default withRouter(connect(mapStatetoProps, {})(withTranslation()(Navbar)));