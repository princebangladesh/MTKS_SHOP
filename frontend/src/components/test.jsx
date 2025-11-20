import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function TestGoogleLogin() {
  return (
    <GoogleOAuthProvider clientId="766488328889-nvgg560l1rhgebec70uhfetvfv80k59i.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={res => console.log('Success:', res)}
        onError={() => console.log('Error')}
      />
    </GoogleOAuthProvider>
  );
}

export default TestGoogleLogin;