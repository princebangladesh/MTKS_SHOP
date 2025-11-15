import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from '@react-oauth/google';
import { FaFacebookF, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import { useLoader } from './shared/loaderContext';
import { useAuth } from './shared/authContext';
import { useWishlist } from './shared/wishlistcontext';
import { useCart } from './shared/cartContext';

const LINKEDIN_CLIENT_ID = '86tafrrdhez9do'; // Replace with real one
const LINKEDIN_REDIRECT_URI = 'http://localhost:3000/login';

function Login() {
  const { setLoading } = useLoader();
  const { isAuthenticated, setToken } = useAuth();
  const { setWishlist } = useWishlist();
  const { setCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/user');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) handleLinkedInCallback(code);
  }, [location]);

  const fetchWishlist = async (accessToken) => {
    try {
      const res = await axios.get('http://localhost:8000/api/wishlist/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setWishlist(res.data[0]?.products ?? []);
    } catch (err) {
      console.warn('Wishlist fetch failed:', err);
    }
  };

  const fetchCart = async (accessToken) => {
    try {
      const res = await axios.get('http://localhost:8000/api/cart-items/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCart(res.data?.items ?? []);
    } catch (err) {
      console.warn('Cart fetch failed:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username: loginData.email,
        password: loginData.password,
      });
      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      await Promise.all([fetchWishlist(access), fetchCart(access)]);
      window.location.href = '/user';
    } catch (err) {
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8000/api/auth/registration/', {
        username: signupData.email,
        email: signupData.email,
        password1: signupData.password,
        password2: signupData.password,
        name: signupData.name,
      });
      setIsSignUp(false);
    } catch (err) {
      setError('Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/auth/google/', {
        id_token: credential,
      });
      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      await Promise.all([fetchWishlist(access), fetchCart(access)]);
      navigate('/user');
    } catch (err) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      setError('Facebook login failed.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/auth/facebook/', {
        access_token: response.accessToken,
      });
      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      await Promise.all([fetchWishlist(access), fetchCart(access)]);
      navigate('/');
    } catch (err) {
      setError('Facebook login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      LINKEDIN_REDIRECT_URI
    )}&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authUrl;
  };

  const handleLinkedInCallback = async (code) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/auth/linkedin/', {
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      });
      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      await Promise.all([fetchWishlist(access), fetchCart(access)]);
      navigate('/');
    } catch (err) {
      setError('LinkedIn login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl h-[500px] bg-gray-100 rounded-xl shadow-lg overflow-hidden">
        {/* Sign In Form */}
        <form
          onSubmit={handleLogin}
          className={`absolute top-0 left-0 w-1/2 h-full p-10 transition-all duration-700 z-20 ${
            isSignUp ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Sign in</h2>
          <div className="flex gap-2 mb-4 items-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
            />
            <FacebookLogin
              appId="1960201038102026"
              fields="name,email,picture"
              callback={handleFacebookResponse}
              render={(renderProps) => (
                <SocialButton icon={<FaFacebookF />} color="#1877F2" onClick={renderProps.onClick} />
              )}
            />
            <SocialButton icon={<FaLinkedin />} color="#0A66C2" onClick={handleLinkedInLogin} />
          </div>
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full px-4 py-2 mb-3 border rounded"
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-3 border rounded"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            SIGN IN
          </button>
        </form>

        {/* Sign Up Form */}
        <form
          onSubmit={handleSignup}
          className={`absolute top-0 left-1/2 w-1/2 h-full p-10 transition-all duration-700 z-20 ${
            isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          <div className="flex gap-2 mb-4 items-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
            />
            <FacebookLogin
              appId="1960201038102026"
              fields="name,email,picture"
              callback={handleFacebookResponse}
              render={(renderProps) => (
                <SocialButton icon={<FaFacebookF />} color="#1877F2" onClick={renderProps.onClick} />
              )}
            />
            <SocialButton icon={<FaXTwitter />} color="black" />
          </div>
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 mb-3 border rounded"
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-3 border rounded"
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-3 border rounded"
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            SIGN UP
          </button>
        </form>

        {/* Right Panel */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center text-white p-10 transition-all duration-700 bg-cover bg-center ${
            isSignUp ? 'right-1/2' : ''
          }`}
          style={{
            backgroundImage: isSignUp
              ? "url('signin-back-image-url')"
              : "url('signup-back-image-url')",
          }}
        >
          <div className="bg-black bg-opacity-50 p-6 rounded text-center">
            <h2 className="text-2xl font-bold mb-2">
              {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
            </h2>
            <p className="mb-6 text-sm">
              {isSignUp
                ? 'To keep connected with us please login with your personal info'
                : 'Enter your personal details and start your journey with us'}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="px-6 py-2 border border-white rounded-full font-bold hover:bg-white hover:text-green-600 transition"
            >
              {isSignUp ? 'SIGN IN' : 'SIGN UP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔘 Reusable social button
const SocialButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="transition-transform hover:scale-150 duration-300 p-2 border rounded-full"
    style={{ color }}
  >
    {icon}
  </button>
);

export default Login;