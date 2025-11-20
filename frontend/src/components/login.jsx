import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FaFacebookF, FaLinkedin, FaXTwitter } from 'react-icons/fa6';


import { useLoader } from './shared/loaderContext';
import { useAuth } from './shared/authContext';
import { useWishlist } from './shared/wishlistcontext';
import { useCart } from './shared/cartContext';
import api from '../config/axios';
import API_BASE_URL from '../config/api';

// Lazy-loaded skeleton
const LoginSkeleton = React.lazy(() => import('./skeleton/LoginSkeleton'));

const SIGNIN_BG = "https://images.unsplash.com/photo-1557682250-33bd709cbe85";
const SIGNUP_BG = "https://images.unsplash.com/photo-1521791136064-7986c2920216";

const LINKEDIN_CLIENT_ID = '86tafrrdhez9do';
const LINKEDIN_REDIRECT_URI = '/login';

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

  // redirect if logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/user');
  }, [isAuthenticated, navigate]);

  // linkedin callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) handleLinkedInCallback(code);
  }, [location]);


  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist/');
      setWishlist(res.data[0]?.products ?? []);
    } catch {}
  };

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart-items/');
      setCart(res.data?.items ?? []);
    } catch {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/token/', {
        username: loginData.email,
        password: loginData.password,
      });

      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate('/user');
    } catch {
      setError('Invalid login credentials');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/registration/', {
        username: signupData.email,
        email: signupData.email,
        password1: signupData.password,
        password2: signupData.password,
        name: signupData.name,
      });
      setIsSignUp(false);
    } catch {
      setError('Signup failed. Try again.');
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (response) => {
    const { access_token } = response;
    setLoading(true);

    try {
      const res = await api.post('/api/auth/google/', {
        id_token: access_token,
      });

      const { access, refresh } = res.data;

      setToken(access);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate('/user');
      window.location.reload();
    } catch {
      setError("Google login failed");
    }

    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google login failed"),
    flow: "implicit",
  });

  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      setError('Facebook login failed.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/facebook/', {
        access_token: response.accessToken,
      });

      const { access, refresh } = res.data;
      setToken(access);

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate('/');
    } catch {
      setError('Facebook login failed');
    }

    setLoading(false);
  };

  const handleLinkedInLogin = () => {
    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        LINKEDIN_REDIRECT_URI
      )}&scope=r_liteprofile%20r_emailaddress`;

    window.location.href = authUrl;
  };

  const handleLinkedInCallback = async (code) => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/linkedin/', {
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      });

      const { access, refresh } = res.data;
      setToken(access);

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate('/');
    } catch {
      setError('LinkedIn login failed');
    }

    setLoading(false);
  };

  return (
    <Suspense fallback={<LoginSkeleton />}>
      <div className="min-h-screen flex items-center justify-center px-4 dark:bg-black">

        <div className="relative w-full max-w-4xl h-[550px] bg-white dark:bg-neutral-900 rounded-xl shadow-xl overflow-hidden transition-all">

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className={`absolute top-0 left-0 w-1/2 h-full p-10 transition-all duration-700 z-20 
           ${isSignUp ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Sign In</h2>

            <div className="flex gap-3 mb-6">

              {/* Google icon only */}
              <SocialButton
                icon={<img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5" />}
                color="#DB4437"
                onClick={googleLogin}
              />

              {/* Facebook */}
              <FacebookLogin
                appId="1960201038102026"
                fields="name,email,picture"
                callback={handleFacebookResponse}
                render={(props) => (
                  <SocialButton icon={<FaFacebookF />} color="#1877F2" onClick={props.onClick} />
                )}
              />

              {/* LinkedIn */}
              <SocialButton icon={<FaLinkedin />} color="#0A66C2" onClick={handleLinkedInLogin} />
            </div>

            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 mb-3 border rounded dark:bg-black dark:text-white"
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-3 border rounded dark:bg-black dark:text-white"
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
              SIGN IN
            </button>
          </form>

          {/* SIGN UP FORM */}
          <form
            onSubmit={handleSignup}
            className={`absolute top-0 left-1/2 w-1/2 h-full p-10 transition-all duration-700 z-20
          ${isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Create Account</h2>

            <div className="flex gap-3 mb-6">
              <SocialButton
                icon={<img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5" />}
                color="#DB4437"
                onClick={googleLogin}
              />

              <FacebookLogin
                appId="1960201038102026"
                fields="name,email,picture"
                callback={handleFacebookResponse}
                render={(props) => (
                  <SocialButton icon={<FaFacebookF />} color="#1877F2" onClick={props.onClick} />
                )}
              />

              <SocialButton icon={<FaXTwitter />} color="black" />
            </div>

            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 mb-3 border rounded dark:bg-black dark:text-white"
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-3 border rounded dark:bg-black dark:text-white"
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-3 border rounded dark:bg-black dark:text-white"
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
              SIGN UP
            </button>
          </form>

          {/* RIGHT SLIDER PANEL */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center text-white p-10 
            transition-all duration-700 bg-cover bg-center
            ${isSignUp ? 'right-1/2' : ''}`}
            style={{
              backgroundImage: `url('${isSignUp ? SIGNIN_BG : SIGNUP_BG}')`,
            }}
          >
            <div className="bg-black/50 p-6 rounded-lg text-center backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-2">
                {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
              </h2>

              <p className="mb-6 text-sm">
                {isSignUp
                  ? 'To keep connected with us please login with your personal info.'
                  : 'Enter your personal details and start your journey.'}
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
    </Suspense>
  );
}

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
