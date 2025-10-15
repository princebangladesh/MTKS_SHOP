import React, { useEffect, useState } from 'react';
import api from './api'; // Your axios instance

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('profile/') // relative to baseURL
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
  <div>
    {profile ? (
      <>
      <h2>Welcome {profile.user.first_name || profile.user.username}</h2>
        <p>Full Name: {profile.user.first_name} {profile.user.last_name}</p>
        <p>Mobile: {profile.phone_number}</p>
        <p>Email: {profile.user.email}</p>
        <p>Billing Address: {profile.billing_address}</p>
        <p>Shipping Address: {profile.shipping_address}</p>
        {profile.profile_picture && (
          <img src={`http://localhost:8000${profile.profile_picture}`} alt="Profile" width={100} />
        )}
      </>
    ) : (
      <p>Loading profile...</p>
    )}
  </div>
);
};

export default Profile;
