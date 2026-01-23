import { useState,useEffect } from 'react';
import axios from 'axios';
import {GoogleLogin} from "@react-oauth/google";
import {useNavigate} from 'react-router-dom';

//Backend server PI base url
const API = "http://localhost:5000";

function Login() {
  
  // create state for login status 
  const [isLogin,setIsLogin]=useState(true);

  //state to store values from Form(name,email,password)
  const [form,setForm]=useState({ name:"",email:"",password:"" });

  //state to store the jwt token
  const [token,setToken]=useState(localStorage.getItem("token"));
  const navigate=useNavigate();
  //register function
  const register =async()=>{
    const res=await axios.post(`${API}/register`,form);
    
    alert(res.data);
    setIsLogin(true);
  };

  //login function
  const login=async()=>{
    const res=await axios.post(`${API}/login`,form);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);

    alert("Login Successful!");
  }

  const logout=async()=>{
    localStorage.removeItem("token");
    setToken(null);
  }

  //conditional UI (two return were given)
  //Logged UI-After Login
   useEffect(() => {
  if (token) {
    navigate("/");
  }
}, [token, navigate]);


  const googleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post(`${API}/google-login`, {
      token: credentialResponse.credential
    });

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    alert("Google Login Successful");
  } catch (err) {
    console.error(err);
    alert("Google login failed");
  }
};

  return(
    <div 
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(90deg,rgba(11, 2, 105, 1) 0%, rgba(9, 9, 121, 1) 26%, rgba(0, 212, 255, 1) 100%)"
      }}
    >
      <div 
        className="container bg-white bg-opacity-100 shadow-lg"
        style={{
          maxWidth: "360px",
          borderRadius: "8px",
          padding: "30px",
          textAlign: "center"
        }}
      >
        <h2 style={{fontWeight:"600", marginBottom:"20px", color:"#333"}}>
          {isLogin?"LOGIN":"REGISTER"}
        </h2> 

        { !isLogin && (
          <input 
            type='text' 
            placeholder='Name' 
            onChange={(e)=>setForm({...form, name: e.target.value})}
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"10px",
              border:"none",
              borderRadius:"4px",
              background:"#eee"
            }}
          />
        )}

        <input 
          type='email' 
          placeholder='Email' 
          onChange={(e)=>setForm({...form, email:e.target.value})} 
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"10px",
            border:"none",
            borderRadius:"4px",
            background:"#eee"
          }}
        />

        <input 
          type='password' 
          placeholder='Password'
          onChange={(e)=>setForm({...form, password:e.target.value})} 
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px",
            border:"none",
            borderRadius:"4px",
            background:"#eee"
          }}
        />

        {isLogin ?
          <button 
            onClick={login}
            style={{
              width:"100%",
              padding:"10px",
              background:"#4d64d9",
              color:"white",
              border:"none",
              borderRadius:"4px",
              fontWeight:"600"
            }}
          >
            LOGIN
          </button>
          :
          <button 
            onClick={register}
            style={{
              width:"100%",
              padding:"10px",
              background:"#4d64d9",
              color:"white",
              border:"none",
              borderRadius:"4px",
              fontWeight:"600"
            }}
          >
            REGISTER
          </button>
        }

        <p 
          onClick={()=>setIsLogin(!isLogin)} 
          style={{
            cursor:"pointer",
            color:"#f53939",
            marginTop:"15px",
            fontSize:"14px"
          }}
        >
          <u>{isLogin?"Not a member? Sign up now":"Already Registered? Login here"}</u>
        </p>
        <hr />
        <h6>OR</h6>
        <GoogleLogin
            onSuccess={googleLogin}
            onError={() => alert("Google Login Failed")}
          />
      </div>
    </div>
  );
}

export default Login;