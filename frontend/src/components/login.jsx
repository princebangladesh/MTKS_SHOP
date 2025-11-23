import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa6";

import { useLoader } from "./shared/loaderContext";
import { useAuth } from "./shared/authContext";
import { useWishlist } from "./shared/wishlistcontext";
import { useCart } from "./shared/cartContext";
import api from "../config/axios";

const LoginSkeleton = React.lazy(() => import("./skeleton/LoginSkeleton"));

const SIGNIN_BG = "https://images.unsplash.com/photo-1557682250-33bd709cbe85";
const SIGNUP_BG = "https://images.unsplash.com/photo-1521791136064-7986c2920216";

const LINKEDIN_CLIENT_ID = "86tafrrdhez9do";
const LINKEDIN_REDIRECT_URI = "/login";

function Login() {
  const { setLoading } = useLoader();
  const { isAuthenticated, setToken } = useAuth();
  const { setWishlist } = useWishlist();
  const { setCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) handleLinkedInCallback(code);
  }, [location]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/api/wishlist/");
      setWishlist(res.data[0]?.products ?? []);
    } catch {}
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart-items/");
      setCart(res.data?.items ?? []);
    } catch {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/token/", {
        username: loginData.email,
        password: loginData.password,
      });

      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate("/user");
    } catch {
      setError("Invalid login credentials");
    }

    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/registration/", {
        username: signupData.email,
        email: signupData.email,
        password1: signupData.password,
        password2: signupData.password,
        name: signupData.name,
      });

      setIsSignUp(false);
    } catch {
      setError("Signup failed. Try again.");
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (response) => {
    const id_token = response.credential;

    setLoading(true);
    try {
      const res = await api.post("/api/auth/google/", { id_token });

      const { access, refresh } = res.data;
      setToken(access);

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate("/user");
    } catch {
      setError("Google login failed");
    }

    setLoading(false);
  };

  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) return setError("Facebook login failed.");

    setLoading(true);
    try {
      const res = await api.post("/api/auth/facebook/", {
        access_token: response.accessToken,
      });

      const { access, refresh } = res.data;

      setToken(access);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate("/user");
    } catch {
      setError("Facebook login failed");
    }

    setLoading(false);
  };

  const handleLinkedInLogin = () => {
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      LINKEDIN_REDIRECT_URI
    )}&scope=r_liteprofile%20r_emailaddress`;

    window.location.href = url;
  };

  const handleLinkedInCallback = async (code) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/linkedin/", {
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      });

      const { access, refresh } = res.data;

      setToken(access);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate("/user");
    } catch {
      setError("LinkedIn login failed");
    }

    setLoading(false);
  };

  return (
    <Suspense fallback={<LoginSkeleton />}>
      <div className="min-h-screen flex items-center justify-center px-6 py-10 dark:bg-black">

        <div className="
          w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl 
          overflow-hidden flex flex-col lg:flex-row transition-all duration-500
        ">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 p-10">

            <div className="flex lg:hidden justify-center mb-6 gap-8">
              <button
                onClick={() => { setIsSignUp(false); setError(""); }}
                className={`pb-2 text-lg border-b-2 ${
                  !isSignUp ? "text-green-600 border-green-600" : "text-gray-400 border-transparent"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => { setIsSignUp(true); setError(""); }}
                className={`pb-2 text-lg border-b-2 ${
                  isSignUp ? "text-green-600 border-green-600" : "text-gray-400 border-transparent"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* SIGN IN */}
            {!isSignUp && (
              <form onSubmit={handleLogin} className="animate-fadeIn">
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Sign In</h2>

                <SocialRow
                  handleGoogle={handleGoogleSuccess}
                  handleFacebook={handleFacebookResponse}
                  handleLinkedIn={handleLinkedInLogin}
                />

                <input
                  type="text"
                  placeholder="Email or Username"
                  className="w-full px-4 py-3 mb-4 border rounded dark:bg-black dark:text-white shadow-sm"
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 mb-4 border rounded dark:bg-black dark:text-white shadow-sm"
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded shadow-md transition">
                  SIGN IN
                </button>
              </form>
            )}

            {/* SIGN UP */}
            {isSignUp && (
              <form onSubmit={handleSignup} className="animate-fadeIn">
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Create Account</h2>

                <SocialRow
                  handleGoogle={handleGoogleSuccess}
                  handleFacebook={handleFacebookResponse}
                  handleLinkedIn={handleLinkedInLogin}
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 mb-4 border rounded dark:bg-black dark:text-white shadow-sm"
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 mb-4 border rounded dark:bg-black dark:text-white shadow-sm"
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 mb-4 border rounded dark:bg-black dark:text-white shadow-sm"
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded shadow-md transition">
                  SIGN UP
                </button>
              </form>
            )}
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div
            className="hidden lg:flex w-1/2 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('${isSignUp ? SIGNUP_BG : SIGNIN_BG}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative z-10 flex flex-col items-center justify-center text-white p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">
                {isSignUp ? "Welcome!" : "Hello, Friend!"}
              </h2>

              <p className="mb-6 max-w-xs text-sm opacity-90">
                {isSignUp
                  ? "Create your account and start your journey."
                  : "Sign in to access your account and continue shopping."}
              </p>

              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="px-6 py-3 border border-white rounded-full font-bold 
                hover:bg-white hover:text-green-700 transition shadow-md"
              >
                {isSignUp ? "SIGN IN" : "SIGN UP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

const SocialRow = ({ handleGoogle, handleFacebook, handleLinkedIn }) => (
  <div className="flex gap-4 mb-6 justify-center">

    {/* GOOGLE ICON ONLY */}
    <GoogleLogin
      onSuccess={handleGoogle}
      onError={() => console.log("Google Error")}
      render={(renderProps) => (
        <SocialButton
          onClick={renderProps.onClick}
          icon={
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
          }
        />
      )}
    />

    {/* FACEBOOK ICON */}
    <FacebookLogin
      appId="1960201038102026"
      fields="name,email,picture"
      callback={handleFacebook}
      render={(props) => (
        <SocialButton icon={<FaFacebookF />} color="#1877F2" onClick={props.onClick} />
      )}
    />

    {/* LINKEDIN ICON */}
    <SocialButton icon={<FaLinkedin />} color="#0A66C2" onClick={handleLinkedIn} />
  </div>
);

const SocialButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="
      p-3 border rounded-full hover:scale-125 transition-transform shadow-sm 
      dark:border-gray-500
    "
    style={{ color }}
  >
    {icon}
  </button>
);

export default Login;
