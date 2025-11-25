import React, { useState, useEffect, Suspense, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa6";

import { GOOGLE_CLIENT_ID } from "../../config";
import { useLoader } from "../shared/loaderContext";
import { useAuth } from "../shared/authContext";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";
import api from "../../config/axios";

const LoginSkeleton = React.lazy(() => import("../skeleton/LoginSkeleton"));

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
  const googleBtnRef = useRef(null);

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [shakeForm, setShakeForm] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

  const [validLogin, setValidLogin] = useState(false);
  const [validSignup, setValidSignup] = useState(false);

  const [loginPasswordStrength, setLoginPasswordStrength] = useState({ score: 0, label: "" });
  const [signupPasswordStrength, setSignupPasswordStrength] = useState({ score: 0, label: "" });

  /* -------------------- LIVE VALIDATION -------------------- */
  useEffect(() => {
    setValidLogin(
      loginData.email.trim().length > 3 && loginData.password.trim().length >= 6
    );
  }, [loginData]);

  useEffect(() => {
    setValidSignup(
      signupData.name.trim().length >= 3 &&
        signupData.email.trim().length > 3 &&
        signupData.password.trim().length >= 6
    );
  }, [signupData]);

  /* -------------------- AUTH REDIRECT -------------------- */
  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) handleLinkedInCallback(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /* -------------------- FETCH DATA AFTER LOGIN -------------------- */
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

  /* -------------------- HELPERS -------------------- */
  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 400);
  };

  const scorePassword = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 0) return { score: 0, label: "" };
    if (score <= 2) return { score, label: "Weak" };
    if (score === 3) return { score, label: "Okay" };
    if (score === 4) return { score, label: "Strong" };
    return { score, label: "Very strong" };
  };

  /* -------------------- EMAIL LOGIN -------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validLogin) return;

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
      triggerShake();
    }

    setLoading(false);
  };

  /* -------------------- SIGNUP -------------------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validSignup) return;

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
      triggerShake();
    }

    setLoading(false);
  };

  /* -------------------- GOOGLE LOGIN -------------------- */
  const handleGoogleSuccess = async (response) => {
    const id_token = response.credential;
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/google/", { id_token });

      const { access, refresh } = res.data;
      setToken(access);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate("/user");
    } catch (err) {
      setError("Google login failed");
      triggerShake();
    }

    setLoading(false);
  };

  /* -------------------- FACEBOOK LOGIN -------------------- */
  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) return setError("Facebook login failed.");

    setLoading(true);
    setError("");

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
      triggerShake();
    }

    setLoading(false);
  };

  /* -------------------- LINKEDIN LOGIN -------------------- */
  const handleLinkedInLogin = () => {
    setError("");
    const url =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
      `&scope=r_liteprofile%20r_emailaddress`;

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
      triggerShake();
    }

    setLoading(false);
  };

  const containerShakeClass = shakeForm ? "animate-shake" : "";

  return (
    <>
      {/* Local styles for shake + fade animations & strength bar transitions */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeInUp 0.25s ease-out;
        }
      `}</style>

      <Suspense fallback={<LoginSkeleton />}>
        <div className="min-h-screen flex items-center justify-center px-6 py-10 dark:bg-black bg-gray-50 transition-colors duration-300">
          <div
            className={`w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row backdrop-blur-lg ${containerShakeClass}`}
          >
            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 p-10">
              {/* Mobile toggle */}
              <div className="flex lg:hidden justify-center mb-6 gap-8">
                <Toggle
                  label="Sign In"
                  active={!isSignUp}
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                />
                <Toggle
                  label="Sign Up"
                  active={isSignUp}
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                />
              </div>

              {/* SIGN IN */}
              {!isSignUp ? (
                <form onSubmit={handleLogin}>
                  <h2 className="text-3xl font-bold mb-6 dark:text-white">Sign In</h2>

                  <SocialButtons
                    googleBtnRef={googleBtnRef}
                    setError={setError}
                    handleFacebook={handleFacebookResponse}
                    handleLinkedIn={handleLinkedInLogin}
                  />

                  <FloatingInput
                    label="Email or Username"
                    type="text"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />

                  <PasswordField
                    label="Password"
                    value={loginData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLoginData({ ...loginData, password: value });
                      setLoginPasswordStrength(scorePassword(value));
                    }}
                    strength={loginPasswordStrength}
                  />

                  {error && (
                    <p className="text-red-500 text-sm mb-3 fade-in">{error}</p>
                  )}

                  <button
                    disabled={!validLogin}
                    className={`w-full py-3 rounded-lg font-semibold mt-1 transition ${
                      validLogin
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    SIGN IN
                  </button>
                </form>
              ) : (
                /* SIGN UP */
                <form onSubmit={handleSignup}>
                  <h2 className="text-3xl font-bold mb-6 dark:text-white">
                    Create Account
                  </h2>

                  <SocialButtons
                    googleBtnRef={googleBtnRef}
                    setError={setError}
                    handleFacebook={handleFacebookResponse}
                    handleLinkedIn={handleLinkedInLogin}
                  />

                  <FloatingInput
                    label="Full Name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                  />

                  <FloatingInput
                    label="Email Address"
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />

                  <PasswordField
                    label="Password"
                    value={signupData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSignupData({ ...signupData, password: value });
                      setSignupPasswordStrength(scorePassword(value));
                    }}
                    strength={signupPasswordStrength}
                  />

                  {error && (
                    <p className="text-red-500 text-sm mb-3 fade-in">{error}</p>
                  )}

                  <button
                    disabled={!validSignup}
                    className={`w-full py-3 rounded-lg font-semibold mt-1 transition ${
                      validSignup
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    SIGN UP
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT SIDE */}
            <RightPanel isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          </div>
        </div>

        {/* HIDDEN GOOGLE LOGIN */}
        <div
          ref={googleBtnRef}
          style={{ height: 0, width: 0, overflow: "hidden" }}
        >
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            useOneTap={false}
          />
        </div>
      </Suspense>
    </>
  );
}

/* -------------------- FLOATING INPUT -------------------- */

const FloatingInput = ({ label, type, value, onChange }) => {
  const active = value.length > 0;

  // Simple validity:  password handled in PasswordField, here just length
  const isValid = value.length > 3;
  const isInvalid = active && !isValid;

  return (
    <div className="relative mb-6 group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
          dark:text-white text-black
          outline-none transition-all duration-300
          ${!active && !isInvalid ? "border-gray-500/40" : ""}
          ${isValid ? "border-green-500 ring-2 ring-green-500/30" : ""}
          ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
          focus:border-green-500 focus:ring-2 focus:ring-green-500/40
        `}
      />

      <label
        className={`
          absolute left-4 px-1 bg-white dark:bg-neutral-900
          transition-all duration-300 pointer-events-none
          ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
          ${isValid ? "text-green-600" : ""}
          ${isInvalid ? "text-red-500" : ""}
          group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-green-500
        `}
      >
        {label}
      </label>

      {isInvalid && (
        <p className="text-red-500 text-xs mt-1 fade-in">
          Must be at least 4 characters
        </p>
      )}
    </div>
  );
};

/* -------------------- PASSWORD FIELD + STRENGTH -------------------- */

const PasswordField = ({ label, value, onChange, strength }) => {
  const active = value.length > 0;
  const isInvalid = active && value.length < 6;

  // For gradient width using 4 steps
  const maxScore = 4;
  const normalizedScore = Math.min(strength.score, maxScore);
  const widthPercent = (normalizedScore / maxScore) * 100;

  let strengthTextColor = "text-gray-400";
  if (strength.label === "Weak") strengthTextColor = "text-red-500";
  else if (strength.label === "Okay") strengthTextColor = "text-orange-500";
  else if (strength.label === "Strong") strengthTextColor = "text-green-500";
  else if (strength.label === "Very strong") strengthTextColor = "text-emerald-500";

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
            dark:text-white text-black
            outline-none transition-all duration-300
            ${!active && !isInvalid ? "border-gray-500/40" : ""}
            ${!isInvalid && value.length >= 6 ? "border-green-500 ring-2 ring-green-500/30" : ""}
            ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
            focus:border-green-500 focus:ring-2 focus:ring-green-500/40
          `}
        />

        <label
          className={`
            absolute left-4 px-1 bg-white dark:bg-neutral-900
            transition-all duration-300 pointer-events-none
            ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
            ${isInvalid ? "text-red-500" : ""}
            group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-green-500
          `}
        >
          {label}
        </label>
      </div>

      {/* Strength meter */}
      {value.length > 0 && (
        <div className="mt-2">
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 transition-all duration-300"
              style={{ width: `${widthPercent}%` }}
            />
          </div>
          <p className={`mt-1 text-xs font-medium ${strengthTextColor} fade-in`}>
            {strength.label || "Too short"}
          </p>
        </div>
      )}

      {isInvalid && (
        <p className="text-red-500 text-xs mt-1 fade-in">
          Password must be at least 6 characters
        </p>
      )}
    </div>
  );
};

/* -------------------- SOCIAL BUTTONS -------------------- */

const SocialButtons = ({ googleBtnRef, setError, handleFacebook, handleLinkedIn }) => (
  <div className="flex gap-6 mb-6 justify-center items-center">
    {/* Google */}
    <AnimatedSocialButton
      color="#DB4437"
      onClick={() => {
        setError("");
        googleBtnRef.current?.querySelector("div[role='button']")?.click();
      }}
      icon={
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-6 h-6"
          alt="Google"
        />
      }
    />

    {/* Facebook */}
    <FacebookLogin
      appId="1960201038102026"
      fields="name,email,picture"
      callback={handleFacebook}
      render={(props) => (
        <AnimatedSocialButton
          color="#1877F2"
          onClick={() => {
            setError("");
            props.onClick();
          }}
          icon={<FaFacebookF className="text-lg" />}
        />
      )}
    />

    {/* LinkedIn */}
    <AnimatedSocialButton
      color="#0A66C2"
      onClick={() => {
        setError("");
        handleLinkedIn();
      }}
      icon={<FaLinkedin className="text-lg" />}
    />
  </div>
);

/* Animated social icon button */
const AnimatedSocialButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-4 rounded-full border border-gray-300 dark:border-gray-500 bg-white/80 dark:bg-neutral-800/80 shadow-sm
               transition-all duration-300 hover:scale-125 hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] active:scale-95"
    style={{ color }}
  >
    {icon}
  </button>
);

/* -------------------- RIGHT PANEL -------------------- */

const RightPanel = ({ isSignUp, setIsSignUp }) => (
  <div
    className="hidden lg:flex w-1/2 bg-cover bg-center relative"
    style={{ backgroundImage: `url('${isSignUp ? SIGNUP_BG : SIGNIN_BG}')` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-pink-800/80 backdrop-blur-md" />

    <div className="relative z-10 flex flex-col items-center justify-center text-white p-10 text-center space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">
        {isSignUp ? "Welcome!" : "Hello, Friend!"}
      </h2>

      <p className="max-w-xs text-sm opacity-90">
        {isSignUp
          ? "Create your account and start your journey with us."
          : "Sign in to access your account and continue shopping."}
      </p>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="px-8 py-3 border border-white rounded-full font-semibold
                   hover:bg-white hover:text-green-700 transition shadow-lg"
      >
        {isSignUp ? "SIGN IN" : "SIGN UP"}
      </button>
    </div>
  </div>
);

/* -------------------- TOGGLE BUTTON -------------------- */

const Toggle = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-2 text-lg border-b-2 transition-all ${
      active ? "text-green-600 border-green-600" : "text-gray-400 border-transparent"
    }`}
  >
    {label}
  </button>
);

export default Login;
