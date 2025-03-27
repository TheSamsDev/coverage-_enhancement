import React, { createContext } from 'react';
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import "./App.css";


//Fake backend
import fakeBackend from './helpers/AuthType/fakeBackend';
import AppRoute from "./routes/route";

// Create a context for sharing store data
export const StoreContext = createContext([]);

// Activating fake backend
fakeBackend();


function App(props) {

	// Get layout based on props
	const getLayout = () => {
		let layoutCls = VerticalLayout;

		switch (props.layout.layoutType) {
			case "horizontal":
				layoutCls = HorizontalLayout;
				break;
			default:
				layoutCls = VerticalLayout;
				break;
		}
		return layoutCls;
	};

	const Layout = getLayout();

	return (
		<React.Fragment>
			<Routes>
				{publicRoutes.map((route, idx) => (
					<Route
						path={route.path}
						element={
							<NonAuthLayout>
								{route.component}
								</NonAuthLayout>
							}
							key={idx}
							exact={true}
						/>
					))}

					{authProtectedRoutes.map((route, idx) => (
						<Route
							path={route.path}
							element={
								<AppRoute>
									<Layout>{route.component}</Layout>
								</AppRoute>}
							key={idx}
							exact={true}
						/>
					))}
				</Routes>
			</React.Fragment>
		);
	}


const mapStateToProps = state => {
	return {
		layout: state.Layout
	};
};


export default connect(mapStateToProps, null)(App);
