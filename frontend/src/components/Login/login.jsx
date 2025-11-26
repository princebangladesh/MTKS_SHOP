import React, { useState, useEffect, Suspense, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa6";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GOOGLE_CLIENT_ID } from "../../config";
import { useLoader } from "../shared/loaderContext";
import { useAuth } from "../shared/authContext";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";
import api from "../../config/axios";

import "./login.css";

const LoginSkeleton = React.lazy(() => import("../skeleton/LoginSkeleton"));

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

  // ⭐ NEW: Redirect Path Fix
  const redirectPath = location.state?.from || "/user";

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [shakeForm, setShakeForm] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validLogin, setValidLogin] = useState(false);
  const [validSignup, setValidSignup] = useState(false);

  const [signupPasswordStrength, setSignupPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  /* ---------------- VALIDATION ----------------*/
  useEffect(() => {
    setValidLogin(
      loginData.email.trim().length > 3 &&
      loginData.password.trim().length >= 6
    );
  }, [loginData]);

  useEffect(() => {
    setValidSignup(
      signupData.name.trim().length >= 3 &&
      signupData.username.trim().length >= 3 &&
      signupData.email.trim().length > 3 &&
      signupData.password.trim().length >= 6 &&
      signupData.password === signupData.confirmPassword
    );
  }, [signupData]);

  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) handleLinkedInCallback(code);
  }, [location]);

  /* ---------------- FETCH AFTER LOGIN ----------------*/
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

  /* ------------------------------------------------------------------
     EMAIL LOGIN (REDIRECT FIX APPLIED)
  ------------------------------------------------------------------ */
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

      navigate(redirectPath, { replace: true });
    } catch {
      setError("Invalid login credentials");
      triggerShake();
    }

    setLoading(false);
  };

  /* ------------------------------------------------------------------
     SIGNUP
  ------------------------------------------------------------------ */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validSignup) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/registration/", {
        username: signupData.username,
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

  /* ------------------------------------------------------------------
     GOOGLE LOGIN (REDIRECT FIX APPLIED)
  ------------------------------------------------------------------ */
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

      navigate(redirectPath, { replace: true });
    } catch {
      setError("Google login failed");
      triggerShake();
    }

    setLoading(false);
  };

  /* ------------------------------------------------------------------
     FACEBOOK LOGIN (REDIRECT FIX APPLIED)
  ------------------------------------------------------------------ */
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

      navigate(redirectPath, { replace: true });
    } catch {
      setError("Facebook login failed");
      triggerShake();
    }

    setLoading(false);
  };

  /* ------------------------------------------------------------------
     LINKEDIN LOGIN (REDIRECT FIX APPLIED)
  ------------------------------------------------------------------ */
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

      navigate(redirectPath, { replace: true });
    } catch {
      setError("LinkedIn login failed");
      triggerShake();
    }

    setLoading(false);
  };

  /* ------------------------------------------------------------------
     UI + FORMS
  ------------------------------------------------------------------ */

  const shellModeClass = isSignUp ? "signup-mode" : "signin-mode";

  return (
    <>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: shake 0.35s ease-in-out; }
      `}</style>

      <Suspense fallback={<LoginSkeleton />}>
        <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-10 bg-gray-100 dark:bg-black">
          <div
            className={`
              auth-shell w-full max-w-5xl bg-white dark:bg-neutral-900
              rounded-3xl shadow-xl 
              ${shakeForm ? "animate-shake" : ""} ${shellModeClass}
            `}
          >

            {/* GREEN PANEL */}
            <div className="side side-panel">
              <div className="panel-layer panel-bg" />
              <div className="panel-layer panel-blob panel-blob-1" />
              <div className="panel-layer panel-blob panel-blob-2" />

              <div className="panel-content">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
                </h2>

                <p className="opacity-90 mb-8 text-sm max-w-xs leading-relaxed text-white">
                  {isSignUp
                    ? "To keep connected with us please login with your personal info."
                    : "Enter your personal details and start your journey with us."}
                </p>

                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="px-10 py-3 border border-white rounded-full font-semibold
                             hover:bg-white hover:text-emerald-600 transition"
                >
                  {isSignUp ? "SIGN IN" : "SIGN UP"}
                </button>
              </div>
            </div>

            {/* FORM AREA */}
            <div className="side side-form">

              {/* LOGIN FORM */}
              <div className="form-box signin">
                <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center md:text-left">
                  Sign In
                </h2>

                <div className="flex justify-center md:justify-start gap-4 mb-6">
                  <SocialButtons
                    googleBtnRef={googleBtnRef}
                    setError={setError}
                    handleFacebook={handleFacebookResponse}
                    handleLinkedIn={handleLinkedInLogin}
                  />
                </div>

                <p className="text-gray-500 text-center md:text-left text-sm mb-6">
                  or use your account
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
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
                    simple={true}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />

                  {error && !isSignUp && (
                    <p className="text-red-500 text-sm fade-in">{error}</p>
                  )}

                  <button
                    disabled={!validLogin}
                    className={`w-full py-3 rounded-lg font-semibold transition
                      ${
                        validLogin
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }
                    `}
                  >
                    SIGN IN
                  </button>
                </form>

                <div className="mobile-auth-link text-center mt-4">
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="underline text-emerald-600"
                  >
                    Create an account
                  </button>
                </div>
              </div>

              {/* SIGNUP FORM */}
              <div className="form-box signup">
                <h2 className="text-3xl font-bold mt-5 text-emerald-600 mb-6 text-center md:text-left">
                  Create Account
                </h2>

                <div className="flex justify-center md:justify-start gap-4 mb-6">
                  <SocialButtons
                    googleBtnRef={googleBtnRef}
                    setError={setError}
                    handleFacebook={handleFacebookResponse}
                    handleLinkedIn={handleLinkedInLogin}
                  />
                </div>

                <p className="text-gray-500 text-center md:text-left text-sm mb-6">
                  or use your email for registration
                </p>

                <form onSubmit={handleSignup} className="space-y-4">
                  <FloatingInput
                    label="Full Name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                  />

                  <FloatingInput
                    label="Username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        username: e.target.value,
                      })
                    }
                  />

                  <FloatingInput
                    label="Email Address"
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
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

                  <PasswordConfirmField
                    label="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    password={signupData.password}
                  />

                  {error && isSignUp && (
                    <p className="text-red-500 text-sm fade-in">{error}</p>
                  )}

                  <button
                    disabled={!validSignup}
                    className={`w-full py-3 rounded-lg font-semibold transition
                      ${
                        validSignup
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }
                    `}
                  >
                    SIGN UP
                  </button>
                </form>

                <div className="mobile-auth-link text-center mt-4">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="underline text-emerald-600"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
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
              useOneTap={true}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}

/* ------------------------------------------------------------------
   FLOATING INPUT
-------------------------------------------------------------------- */
const FloatingInput = ({ label, type, value, onChange }) => {
  const active = value.length > 0;
  const isValid = value.length > 3;
  const isInvalid = active && !isValid;

  return (
    <div className="relative mb-4 group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
          dark:text-white text-black
          outline-none transition-all duration-300
          ${!active && !isInvalid ? "border-gray-500/40" : ""}
          ${isValid ? "border-emerald-500 ring-2 ring-emerald-500/30" : ""}
          ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
          focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40
        `}
      />

      <label
        className={`
          absolute left-4 px-1 bg-white dark:bg-neutral-900
          transition-all duration-300 pointer-events-none
          ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
          ${isValid ? "text-emerald-600" : ""}
          ${isInvalid ? "text-red-500" : ""}
          group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-emerald-500
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

/* ------------------------------------------------------------------
   PASSWORD FIELD 
-------------------------------------------------------------------- */
function PasswordField({
  label,
  value,
  onChange,
  strength = null,
  simple = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const active = value.length > 0;
  const isInvalid = active && value.length < 6 && !simple;

  let strengthTextColor = "text-gray-400";
  if (strength?.label === "Weak") strengthTextColor = "text-red-500";
  else if (strength?.label === "Okay") strengthTextColor = "text-orange-500";
  else if (strength?.label === "Strong") strengthTextColor = "text-green-500";
  else if (strength?.label === "Very strong") strengthTextColor = "text-emerald-500";

  const maxScore = 4;
  const widthPercent = strength
    ? (Math.min(strength.score, maxScore) / maxScore) * 100
    : 0;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
            dark:text-white text-black
            outline-none transition-all duration-300
            ${!active && !isInvalid ? "border-gray-500/40" : ""}
            ${isInvalid ? "border-red-500 ring-2 ring-red-500/30" : ""}
            ${!simple && value.length >= 6 ? "border-green-500 ring-2 ring-green-500/30" : ""}
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

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {!simple && value.length > 0 && (
        <div className="mt-2 fade-in">
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 transition-all duration-300"
              style={{ width: `${widthPercent}%` }}
            />
          </div>

          <p className={`mt-1 text-xs font-medium ${strengthTextColor}`}>{strength.label || "Too short"}</p>
        </div>
      )}

      {isInvalid && !simple && (
        <p className="text-red-500 text-xs mt-1 fade-in">
          Password must be at least 6 characters
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   CONFIRM PASSWORD FIELD
-------------------------------------------------------------------- */
const PasswordConfirmField = ({ label, value, onChange, password }) => {
  const active = value.length > 0;
  const isMatch = value === password;
  const isInvalid = active && !isMatch;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg
            outline-none transition-all
            ${
              isMatch && active
                ? "border-emerald-500 ring-2 ring-emerald-500/30"
                : "border-gray-500/40"
            }
            ${isInvalid ? "border-red-500 ring-red-500/30" : ""}
          `}
        />

        <label
          className={`
            absolute left-4 px-1 bg-white dark:bg-neutral-900
            transition-all duration-300 pointer-events-none
            ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
          `}
        >
          {label}
        </label>
      </div>

      {isInvalid && (
        <p className="text-red-500 text-xs mt-1 fade-in">
          Passwords do not match
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
   SOCIAL BUTTONS
-------------------------------------------------------------------- */
const SocialButtons = ({
  googleBtnRef,
  setError,
  handleFacebook,
  handleLinkedIn,
}) => (
  <div className="flex gap-6 mb-6 justify-center md:justify-start items-center">
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

const AnimatedSocialButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-4 rounded-full border border-gray-300 dark:border-gray-500 bg-white/80 dark:bg-neutral-800/80 shadow-sm transition-all duration-300 hover:scale-125 hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] active:scale-95"
    style={{ color }}
  >
    {icon}
  </button>
);

export default Login;
