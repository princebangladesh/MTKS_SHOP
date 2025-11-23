import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function TestGoogleLogin() {
  return (
    <GoogleOAuthProvider clientId="766488328889-8kqb759ul62ek978a9l3t5lcqjecliqk.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={res => console.log('Success:', res)}
        onError={() => console.log('Error')}
      />
    </GoogleOAuthProvider>
  );
}

export default TestGoogleLogin;