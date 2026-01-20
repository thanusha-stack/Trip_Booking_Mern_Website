import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container text-center mt-5">
      <img
        src={user.photo}
        alt="profile"
        className="rounded-circle mb-3"
        width="120"
      />
      <h4>{user.name}</h4>
      <p>{user.email}</p>

      <button className="btn btn-dark mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
