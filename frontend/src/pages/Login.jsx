import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await googleLogin();
      navigate("/profile");
    } catch (error) {
      alert("Google Login Failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-4">Login</h4>

        <button
          onClick={handleLogin}
          className="btn btn-danger w-100"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
