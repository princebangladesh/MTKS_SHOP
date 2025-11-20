import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { BASE_URL } from '../../config/api';

export default function GoogleAuth() {
  const handleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/social/login/`, {
        provider: 'google',
        access_token: credential,
      });

      // Store token in localStorage or context
      localStorage.setItem('access_token', res.data.access_token);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error('Google login failed')}
      />
    </div>
  );
}
