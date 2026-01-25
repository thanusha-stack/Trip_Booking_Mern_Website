import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Normal login
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, form);
       login(res.data.user, res.data.token);
      alert("Login Successful!");
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Register
  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/register`, form);
      alert(res.data.message);
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post(`${API}/google-login`, {
      tokenId: credentialResponse.credential, // must match backend
    });
    login(res.data.user, res.data.token);
    alert("Google Login Successful");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Google login failed");
  }
};


  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(90deg,rgba(11, 2, 105, 1) 0%, rgba(9, 9, 121, 1) 26%, rgba(0, 212, 255, 1) 100%)" }}>
      <div className="container bg-white shadow-lg" style={{ maxWidth: "360px", borderRadius: "8px", padding: "30px", textAlign: "center" }}>
        <h2 style={{ fontWeight: "600", marginBottom: "20px", color: "#333" }}>
          {isLogin ? "LOGIN" : "REGISTER"}
        </h2>

        {!isLogin && <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "none", borderRadius: "4px", background: "#eee" }} />}

        <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "none", borderRadius: "4px", background: "#eee" }} />

        <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "15px", border: "none", borderRadius: "4px", background: "#eee" }} />

        {isLogin ? (
          <button onClick={handleLogin} style={{ width: "100%", padding: "10px", background: "#4d64d9", color: "white", border: "none", borderRadius: "4px", fontWeight: "600" }}>
            LOGIN
          </button>
        ) : (
          <button onClick={handleRegister} style={{ width: "100%", padding: "10px", background: "#4d64d9", color: "white", border: "none", borderRadius: "4px", fontWeight: "600" }}>
            REGISTER
          </button>
        )}

        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "#f53939", marginTop: "15px", fontSize: "14px" }}>
          <u>{isLogin ? "Not a member? Sign up now" : "Already Registered? Login here"}</u>
        </p>

        <hr />
        <h6>OR</h6>
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Failed")} />
      </div>
    </div>
  );
}

export default Login;
