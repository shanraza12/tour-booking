import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTER_START" });
    setError(null);
    setIsEmailValid(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message);
        dispatch({ type: "REGISTER_FAILURE", payload: result.message });
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        dispatch({ type: "REGISTER_SUCCESS", payload: result });
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      dispatch({ type: "REGISTER_FAILURE", payload: error.message });
    }
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleEmailChange = (e) => {
    setIsEmailValid(validateEmail(e.target.value));
    handleChange(e);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Create Account</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="text" placeholder="Username" required id="username" onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="email" placeholder="Email Address" required autoComplete="email" id="email" onChange={handleEmailChange} />
                    {!isEmailValid && <div className="alert alert-danger mt-1">Please enter a valid email address</div>}
                  </FormGroup>
                  <FormGroup>
                    <div className="password__input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        id="password"
                        onChange={handleChange}
                      />
                      <i className={`ri-eye-line${showPassword ? "-slash" : ""}`} onClick={togglePasswordVisibility}></i>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <select
                      id="role"
                      onChange={handleChange}
                      value={credentials.role}
                      className="form-select"
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', width: '100%', marginBottom: '4px' }}
                    >
                      <option value="user">I am a Traveller (Client)</option>
                      <option value="agency">I represent a Travel Agency</option>
                    </select>
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit" onClick={handleClick}>
                    Create Account
                  </Button>
                </Form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
