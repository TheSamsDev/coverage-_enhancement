import React, { Component } from "react";
import { Collapse, Container } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({});
        }
    }

    componentDidMount() {
        this.activateParentDropdown();
    }

    activateParentDropdown = () => {
        const { pathname } = this.props.location;
        const ul = document.getElementById("navigation");
        const items = ul.getElementsByTagName("a");
        for (let i = 0; i < items.length; ++i) {
            if (pathname === items[i].pathname) {
                const item = items[i];
                item.classList.add("active");
                let parent = item.parentElement;
                while (parent) {
                    parent.classList.add("active");
                    parent = parent.parentElement;
                }
                break;
            }
        }
    };

    render() {
        const { t, location } = this.props;
        const { pathname } = location;

        return (
            <React.Fragment>
                <div className="topnav mystical-navbar">
                    <Container fluid>
                        <nav className="navbar navbar-expand-lg topnav-menu" id="navigation">
                            <Collapse isOpen={this.props.menuOpen} className="navbar-collapse">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className={pathname === "/dashboard" ? "nav-link nav-3d active" : "nav-link nav-3d"} to="/">
                                            <i className="ri-dashboard-line me-2"></i>
                                            <span>{t('Dashboard')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/coverage-enhancement" className={pathname === "/coverage-enhancement" ? "nav-link nav-3d active" : "nav-link nav-3d"}>
                                            <i className="ri-signal-tower-line me-2"></i>
                                            <span>{t('Coverage Enhancement')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/sales-analytics" className={pathname === "/sales-analytics" ? "nav-link nav-3d active" : "nav-link nav-3d"}>
                                            <i className="ri-pie-chart-box-line me-2"></i>
                                            <span>{t('Sales Analytics')}</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/stores" className={pathname === "/stores" ? "nav-link nav-3d active" : "nav-link nav-3d"}>
                                            <i className="ri-store-2-line me-2"></i>
                                            <span>{t('Stores')}</span>
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

const NavbarWithRouter = (props) => {
    const location = useLocation();
    return <Navbar {...props} location={location} />;
};

export default connect(mapStatetoProps, {})(withTranslation()(NavbarWithRouter));