import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = `${process.env.REACT_APP_API_URL}/api/auth`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tourist" });

  // Normal login
  const handleLogin = async () => {
    console.log("Attempting login at:", `${API}/login`);
    try {
      const res = await axios.post(`${API}/login`, form);
      console.log("Login success:", res.data);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Register
  const handleRegister = async () => {
    console.log("Attempting register at:", `${API}/register`);
    try {
      const res = await axios.post(`${API}/register`, form);
      console.log("Register success:", res.data);
      alert("Registration successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || "Registration failed");
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
          <>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                border: "none",
                borderRadius: "4px",
                background: "#eee",
              }}
            >
              <option value="tourist">Tourist</option>
              <option value="organizer">Organizer</option>
            </select>
            <button onClick={handleRegister} style={{ width: "100%", padding: "10px", background: "#4d64d9", color: "white", border: "none", borderRadius: "4px", fontWeight: "600" }}>
              REGISTER
            </button>
          </>
        )}

        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "#f53939", marginTop: "15px", fontSize: "14px" }}>
          <u>{isLogin ? "Not a member? Sign up now" : "Already Registered? Login here"}</u>
        </p>


      </div>
    </div>
  );
}

export default Login;
