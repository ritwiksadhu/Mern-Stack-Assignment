import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpHandler } from "../services/rest";

const Signup = () => {
  const [signUpData, setSignupData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpHandler(signUpData);
      console.log(response.data);
      localStorage.setItem("token", response.data.authToken);
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Signup failed with status:", error.response.status);
        console.error("Error data:", error.response.data.error);
      } else if (error.request) {
        console.error("Signup failed: No response received");
        console.error("Error request:", error.request);
      } else {
        console.error("Signup failed:", error.message);
      }
    }
  };

  function handleChangeSignupData(e) {
    const { name, value } = e.target;
    setSignupData({ ...signUpData, [name]: value });
  }

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="w-50 mx-auto">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={signUpData.name || ""}
            onChange={(e) => handleChangeSignupData(e)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={signUpData.email || ""}
            onChange={(e) => handleChangeSignupData(e)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={signUpData.password || ""}
              onChange={(e) => handleChangeSignupData(e)}
              name="password"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={"bi " + (showPassword ? " bi-eye-slash" : "bi-eye")}
              ></i>
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Signup;
