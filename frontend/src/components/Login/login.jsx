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
  const { setToken } = useAuth();
  const { setWishlist } = useWishlist();
  const { setCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  // ⭐ FIX: Get redirect target
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

  /* VALIDATIONS */
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

  /* LINKEDIN CALLBACK LISTENER */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) handleLinkedInCallback(code);
  }, [location]);

  /* FETCH WISHLIST & CART */
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

  /* HELPERS */
  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 400);
  };

  const scorePassword = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: "Weak" };
    if (score === 2) return { score, label: "Okay" };
    if (score === 3) return { score, label: "Strong" };
    return { score, label: "Very strong" };
  };

  /* ---------------- EMAIL LOGIN ---------------- */
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

      // ⭐ FIXED: Redirect correctly
      navigate(redirectPath, { replace: true });
    } catch {
      setError("Invalid login credentials");
      triggerShake();
    }

    setLoading(false);
  };

  /* ---------------- SIGNUP ---------------- */
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

  /* ---------------- GOOGLE LOGIN ---------------- */
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

  /* ---------------- FACEBOOK LOGIN ---------------- */
  const handleFacebookResponse = async (response) => {
    if (!response.accessToken)
      return setError("Facebook login failed.");

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

  /* ---------------- LINKEDIN LOGIN ---------------- */
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

  /* ---------------- UI ---------------- */
  const shellModeClass = isSignUp ? "signup-mode" : "signin-mode";

  return (
    <>
      <Suspense fallback={<LoginSkeleton />}>
        <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-10 bg-gray-100 dark:bg-black">
          <div
            className={`auth-shell w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-xl ${shakeForm ? "animate-shake" : ""
              } ${shellModeClass}`}
          >

            {/* LEFT PANEL */}
            <div className="side side-panel">
              <div className="panel-content">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
                </h2>

                <p className="text-white opacity-80 mb-6 max-w-sm">
                  {isSignUp
                    ? "To keep connected with us please login with your personal info."
                    : "Enter your personal details and start your journey with us."}
                </p>

                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="px-10 py-3 border border-white rounded-full text-white hover:bg-white hover:text-emerald-600 transition"
                >
                  {isSignUp ? "SIGN IN" : "SIGN UP"}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE FORMS */}
            <div className="side side-form">

              {/* LOGIN FORM */}
              <div className="form-box signin">
                <h2 className="text-3xl font-bold text-emerald-600 mb-6">
                  Sign In
                </h2>

                <SocialButtons
                  googleBtnRef={googleBtnRef}
                  setError={setError}
                  handleFacebook={handleFacebookResponse}
                  handleLinkedIn={handleLinkedInLogin}
                />

                <p className="text-gray-500 text-sm mb-6">or use your account</p>

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
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    disabled={!validLogin}
                    className={`w-full py-3 rounded-lg font-semibold transition ${validLogin
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    SIGN IN
                  </button>
                </form>

                <div className="text-center mt-4 md:hidden">
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-emerald-600 underline"
                  >
                    Create an account
                  </button>
                </div>
              </div>

              {/* SIGNUP FORM */}
              <div className="form-box signup">
                <h2 className="text-3xl font-bold text-emerald-600 mb-6">
                  Create Account
                </h2>

                <SocialButtons
                  googleBtnRef={googleBtnRef}
                  setError={setError}
                  handleFacebook={handleFacebookResponse}
                  handleLinkedIn={handleLinkedInLogin}
                />

                <p className="text-gray-500 text-sm mb-6">or use your email</p>

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
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />

                  <PasswordField
                    label="Password"
                    value={signupData.password}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSignupData({ ...signupData, password: v });
                      setSignupPasswordStrength(scorePassword(v));
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
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    disabled={!validSignup}
                    className={`w-full py-3 rounded-lg font-semibold transition ${validSignup
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    SIGN UP
                  </button>
                </form>

                <div className="text-center mt-4 md:hidden">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-emerald-600 underline"
                  >
                    Already have an account?
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HIDDEN GOOGLE BUTTON */}
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

/* ---------------- INPUT COMPONENTS ---------------- */

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
        className={`w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg transition-all
          ${!active ? "border-gray-400/50" : ""}
          ${isValid ? "border-emerald-500 ring-emerald-500/30 ring-2" : ""}
          ${isInvalid ? "border-red-500 ring-red-500/30 ring-2" : ""}
        `}
      />

      <label
        className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all pointer-events-none
          ${active ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
          ${isValid ? "text-emerald-600" : ""}
          ${isInvalid ? "text-red-500" : ""}
        `}
      >
        {label}
      </label>
    </div>
  );
};

function PasswordField({ label, value, onChange, strength = null, simple }) {
  const [show, setShow] = useState(false);
  const active = value.length > 0;
  const isInvalid = active && value.length < 6 && !simple;

  let strengthColor =
    strength?.label === "Weak"
      ? "text-red-500"
      : strength?.label === "Okay"
      ? "text-orange-500"
      : strength?.label === "Strong"
      ? "text-green-500"
      : strength?.label === "Very strong"
      ? "text-emerald-500"
      : "text-gray-400";

  const width = strength ? (strength.score / 4) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg transition-all
            ${!active ? "border-gray-400/50" : ""}
            ${isInvalid ? "border-red-500 ring-red-500/30 ring-2" : ""}
            ${!simple && value.length >= 6 ? "border-green-500 ring-green-500/30 ring-2" : ""}
          `}
        />

        <label
          className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all pointer-events-none
            ${active ? "-top-3 text-xs" : "top-3 text-gray-400"}
            ${isInvalid ? "text-red-500" : ""}
          `}
        >
          {label}
        </label>

        <span
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {!simple && value && (
        <div className="mt-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all"
              style={{ width: `${width}%` }}
            />
          </div>

          <p className={`text-xs mt-1 ${strengthColor}`}>
            {strength.label || "Too short"}
          </p>
        </div>
      )}
    </div>
  );
}

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
          className={`w-full px-4 pt-5 pb-2 border rounded-lg transition-all
            ${isMatch ? "border-emerald-500 ring-emerald-500/30 ring-2" : "border-gray-400/50"}
            ${isInvalid ? "border-red-500 ring-red-500/30 ring-2" : ""}
          `}
        />

        <label
          className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 transition-all pointer-events-none
            ${active ? "-top-3 text-xs" : "top-3 text-gray-400"}
          `}
        >
          {label}
        </label>
      </div>

      {isInvalid && (
        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
      )}
    </div>
  );
};

/* ---------------- SOCIAL BUTTONS ---------------- */
const SocialButtons = ({
  googleBtnRef,
  setError,
  handleFacebook,
  handleLinkedIn,
}) => (
  <div className="flex gap-6 mb-6 justify-center md:justify-start">
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
      onClick={handleLinkedIn}
      icon={<FaLinkedin className="text-lg" />}
    />
  </div>
);

const AnimatedSocialButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 hover:scale-125 transition shadow"
    style={{ color }}
  >
    {icon}
  </button>
);

export default Login;
