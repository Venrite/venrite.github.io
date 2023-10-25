import React from "react";
import { useAuth0 } from "@auth0/auth0-react";


const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="profile">
        <img className="userImg"src={user.picture} alt={user.name} />
        <h2 className="userName">{user.name}</h2>
       
      </div>
    )
  );
};

export default Profile;
