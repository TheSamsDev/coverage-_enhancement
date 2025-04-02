import React, { useEffect, useRef } from "react";
import { Row, Col, Input, Button, Alert, Container, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL JS

// actions
import { checkLogin, apiError } from "../../store/actions";

// import images
import logodark from "../../assets/images/favcion.png";
import logolight from "../../assets/images/favcion.png";

// Custom CSS for light mode with Mapbox
const customStyles = `
  .auth-body-bg {
    background: #f5f7fa; /* Light gray background for light mode */
    color: #333333; /* Dark text for readability */
    overflow: hidden;
  }
  .authentication-page-content {
    background: rgba(255, 255, 255, 0.9); /* Light glassmorphism effect */
    backdrop-filter: blur(8px);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* Subtle shadow for light mode */
    border: 1px solid rgba(0, 0, 0, 0.05);
    animation: fadeIn 1s ease-in-out; /* Fade-in animation */
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .map-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
`;

const Login = (props) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { username: "admin@themesdesign.in", password: "123456" }
  });

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    props.apiError("");
    document.body.classList.add("auth-body-bg");

    // Inject custom styles dynamically
    const styleSheet = document.createElement("style");
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);

    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3llZHphbWFuMDA5NiIsImEiOiJjbThxZGltbGYwaDA4MmtzYW55eHJvazc1In0.x4yA3Enz1S-DtCrrGrPpaQ'; // Replace with your Mapbox token
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10', // Light map style for light mode
      // center: [67.0011, 24.8607], // Karachi, Pakistan coordinates
      center: [74.3436, 31.5497], // Lahore, Pakistan coordinates
      zoom: 15, // Higher zoom to show buildings
      pitch: 60, // 3D tilt
      bearing: 0, // Initial bearing
      interactive: false, // Disable user interaction
    });

    // Add 3D buildings when the map loads
    map.current.on('load', () => {
      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14, // Ensure buildings appear
        paint: {
          'fill-extrusion-color': '#0056b3', // Deep blue buildings for light mode
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'base_height'],
          'fill-extrusion-opacity': 0.9, // Slightly more opaque
        },
      });

      // Continuous rotation animation
      let bearing = 0;
      const animateMap = () => {
        bearing = (bearing + 0.5) % 360; // Increment bearing for continuous rotation
        map.current.setBearing(bearing);
        requestAnimationFrame(animateMap); // Loop the animation
      };
      requestAnimationFrame(animateMap);
    });

    return () => {
      document.body.className = document.body.className.replace("auth-body-bg", "");
      document.head.removeChild(styleSheet);
      map.current.remove(); // Clean up Mapbox on unmount
    };
  }, [props]);

  const onSubmit = (values) => {
    props.checkLogin(values, navigate);
  };

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Row className="justify-content-center">
                    <Col lg={9}>
                      <div>
                        <div className="text-center">
                          <Link to="/" className="">
                            <img src={logodark} alt="" height="49" className="auth-logo logo-dark mx-auto" />
                            <img src={logolight} alt="" height="49" className="auth-logo logo-light mx-auto" />
                          </Link>
                          <h4 className="font-size-18 mt-4">Welcome Back!</h4>
                          <p className="text-muted">Sign in to continue to Coverage Enhancement</p>
                        </div>
                        {props.loginError && <Alert color="danger">{props.loginError}</Alert>}
                        <div className="p-2 mt-5">
                          <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-user-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="username">Email</Label>
                              <Input
                                {...register("username", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: "Invalid email format"
                                  }
                                })}
                                type="text"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                id="username"
                                placeholder="Enter username"
                              />
                              {errors.username && (
                                <div className="invalid-feedback">{errors.username.message}</div>
                              )}
                            </div>

                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-lock-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="userpassword">Password</Label>
                              <Input
                                {...register("password", { required: "Password is required" })}
                                type="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                id="userpassword"
                                placeholder="Enter password"
                              />
                              {errors.password && (
                                <div className="invalid-feedback">{errors.password.message}</div>
                              )}
                            </div>

                            <div className="form-check">
                              <Input type="checkbox" className="form-check-input" id="customControlInline" />
                              <Label className="form-check-label" htmlFor="customControlInline">
                                Remember me
                              </Label>
                            </div>

                            <div className="mt-4 text-center">
                              <Button
                                color="primary"
                                className="w-md waves-effect waves-light"
                                type="submit"
                              >
                                Log In
                              </Button>
                            </div>

                            <div className="mt-4 text-center">
                              <Link to="/forgot-password" className="text-muted">
                                <i className="mdi mdi-lock me-1"></i> Forgot your password?
                              </Link>
                            </div>
                          </form>
                        </div>

                        <div className="mt-5 text-center">
                          <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="fw-medium text-primary">
                              Register
                            </Link>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              {/* Mapbox container for 3D street map */}
              <div ref={mapContainer} className="map-container" />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { loginError } = state.Login;
  return { loginError };
};

export default connect(mapStatetoProps, { checkLogin, apiError })(Login);