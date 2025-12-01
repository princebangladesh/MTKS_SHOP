// ========================= IMPORTS =========================
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ResetPasswordSteps from "./ResetPasswordSteps";
import SignupSteps from "./SignupSteps";

import FloatingInput from "./FloatingInput";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";

import { GOOGLE_CLIENT_ID, LINKEDIN_CLIENT_ID } from "../../config";
import { useLoader } from "../shared/loaderContext";
import { useAuth } from "../shared/authContext";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";
import api from "../../config/axios";

import "./login.css";
import { BASE_URL } from "../../config/api";

const LoginSkeleton = React.lazy(() => import("../skeleton/LoginSkeleton"));

const LINKEDIN_REDIRECT_URI = "/login";

// ========================= MAIN =========================
function Login() {
  const { setLoading } = useLoader();
  const { isAuthenticated, setToken } = useAuth();
  const { setWishlist } = useWishlist();
  const { setCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/user";

  // ---------------- UI STATES ----------------
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetStep, setIsResetStep] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [slide, setSlide] = useState("slide-center");
  const [shakeForm, setShakeForm] = useState(false);
  const [error, setError] = useState("");

  // ---------------- Login data ----------------
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validLogin, setValidLogin] = useState(false);

  // ---------------- Signup data ----------------
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validSignup, setValidSignup] = useState(false);
  const [signupPasswordStrength, setSignupPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  const [emailExists, setEmailExists] = useState(null);
  const [usernameExists, setUsernameExists] = useState(null);

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [signupStep, setSignupStep] = useState(1);
  const [signupCountdown, setSignupCountdown] = useState(5);

  // ---------------- Reset Password ----------------
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailExists, setResetEmailExists] = useState(null);
  const [resetMessage, setResetMessage] = useState("");

  // ==================== VALIDATIONS ====================
  useEffect(() => {
    setValidLogin(
      loginData.email.trim().length > 3 &&
      loginData.password.trim().length >= 6
    );
  }, [loginData]);

  useEffect(() => {
    setValidSignup(
      signupData.first_name.trim().length >= 2 &&
      signupData.last_name.trim().length >= 2 &&
      signupData.username.trim().length >= 3 &&
      signupData.email.trim().length > 3 &&
      signupData.password.trim().length >= 6 &&
      signupData.password === signupData.confirmPassword &&
      usernameExists !== true &&
      emailExists !== true
    );
  }, [signupData, emailExists, usernameExists]);

  // ==================== AUTO REDIRECT ====================
  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated]);

  // ==================== GOOGLE LOGIN INIT (GIS) ====================
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("realGoogleBtn"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  // ==================== GOOGLE CALLBACK ====================
  const handleGoogleCredential = async (response) => {
    const { credential: id_token } = response;

    if (!id_token) {
      setError("Google login failed: missing ID token");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/google/", { id_token });

      const { access, refresh } = res.data;

      setToken(access);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.log(err);
      setError("Google login failed");
      triggerShake();
    }

    setLoading(false);
  };

  // ==================== SHAKE ====================
  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 400);
  };

  // ==================== FETCH HELPERS ====================
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

  // ==================== LOGIN HANDLER ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validLogin) return;

    setLoading(true);

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

  // ==================== SIGNUP HANDLER ====================
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validSignup) return;

    setLoading(true);

    try {
      await api.post("/auth/registration/", {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        first_name: signupData.first_name,
        last_name: signupData.last_name,
      });

      setSlide("slide-right");

      setTimeout(() => {
        setSignupStep(2);
        setSignupCountdown(5);
        setSlide("slide-center");
      }, 450);

    } catch (err) {
      if (err.response?.data?.email) {
        setError("❌ Email already exists");
      } else if (err.response?.data?.username) {
        setError("❌ Username already exists");
      } else {
        setError("Signup failed.");
      }
      triggerShake();
    }

    setLoading(false);
  };

  // ==================== SIGNUP COUNTDOWN ====================
  useEffect(() => {
    if (signupStep !== 2) return;

    if (signupCountdown === 0) {
      setSlide("slide-right");
      setTimeout(() => {
        setIsSignUp(false);
        setSignupStep(1);
        setSlide("slide-center");
      }, 450);
      return;
    }

    const t = setTimeout(() => setSignupCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [signupStep, signupCountdown]);

  // ==================== FACEBOOK LOGIN ====================
  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) return;

    setLoading(true);

    try {
      const res = await api.post("/api/auth/facebook/", {
        access_token: response.accessToken,
      });

      setToken(res.data.access);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      await Promise.all([fetchWishlist(), fetchCart()]);
      navigate(redirectPath, { replace: true });

    } catch {
      triggerShake();
    }

    setLoading(false);
  };

  // ==================== LINKEDIN LOGIN ====================
  const handleLinkedInLogin = () => {
    window.location.href =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
      `&scope=r_liteprofile%20r_emailaddress`;
  };

  // ========================= RENDER =========================
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100 dark:bg-black">

        {/* Hidden but Active Google Login Button */}
        <div
          id="realGoogleBtn"
          style={{
            opacity: 0,
            width: 0,
            height: 0,
            overflow: "hidden",
            position: "absolute",
            zIndex: -99,
          }}
        ></div>

        <div
          className={`
            auth-shell w-full max-w-5xl bg-white dark:bg-neutral-900
            rounded-3xl shadow-xl
            ${isSignUp ? "signup-mode" : "signin-mode"}
            ${shakeForm ? "animate-shake" : ""}
          `}
        >

          {/* LEFT PANEL */}
          <LeftPanel
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            setIsResetStep={setIsResetStep}
            setResetStep={setResetStep}
            setSlide={setSlide}
          />

          {/* RIGHT PANEL */}
          <div className="side side-form">

            {/* LOGIN / RESET */}
            <div className="form-box signin slide-container">
              <div className={`slide-panel ${slide}`}>

                {!isResetStep ? (
                  <LoginView
                    googleBtnId={"realGoogleBtn"}
                    handleLogin={handleLogin}
                    handleFacebook={handleFacebookResponse}
                    handleLinkedIn={handleLinkedInLogin}
                    loginData={loginData}
                    setLoginData={setLoginData}
                    validLogin={validLogin}
                    error={error}
                    setIsSignUp={setIsSignUp}
                    setIsResetStep={setIsResetStep}
                    setResetStep={setResetStep}
                    setError={setError}
                    setSlide={setSlide}
                  />
                ) : (
                  <ResetPasswordSteps
                    resetStep={resetStep}
                    setResetStep={setResetStep}
                    resetEmail={resetEmail}
                    setResetEmail={setResetEmail}
                    resetEmailExists={resetEmailExists}
                    resetMessage={resetMessage}
                    setResetMessage={setResetMessage}
                    setLoading={setLoading}
                    setIsResetStep={setIsResetStep}
                    setSlide={setSlide}
                  />
                )}

              </div>
            </div>

            {/* SIGNUP */}
            <form onSubmit={handleSignup}>
              <SignupSteps
                signupStep={signupStep}
                signupData={signupData}
                setSignupData={setSignupData}
                signupPasswordStrength={signupPasswordStrength}
                setSignupPasswordStrength={setSignupPasswordStrength}
                validSignup={validSignup}
                emailExists={emailExists}
                usernameExists={usernameExists}
                checkingEmail={checkingEmail}
                checkingUsername={checkingUsername}
                setIsSignUp={setIsSignUp}
                setSlide={setSlide}
                countdown={signupCountdown}
              />
            </form>

          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default Login;

// ============================== LEFT PANEL ==============================
function LeftPanel({ isSignUp, setIsSignUp, setIsResetStep, setResetStep, setSlide }) {
  return (
    <div className="side side-panel">
      <div className="panel-layer panel-bg" />
      <div className="panel-layer panel-blob panel-blob-1" />
      <div className="panel-layer panel-blob panel-blob-2" />

      <div className="panel-content">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
        </h2>

        <p className="opacity-90 mb-8 text-sm leading-relaxed text-white max-w-xs">
          {isSignUp
            ? "To keep connected with us please login using your personal info."
            : "Enter your personal details and start your journey with us."}
        </p>

        <button
          onClick={() => {
            setSlide(isSignUp ? "slide-right" : "slide-left");

            setTimeout(() => {
              setIsSignUp(!isSignUp);
              setIsResetStep(false);
              setResetStep(1);
              setSlide("slide-center");
            }, 450);
          }}
          className="px-10 py-3 border border-white rounded-full font-semibold
            hover:bg-white hover:text-emerald-600 transition"
        >
          {isSignUp ? "SIGN IN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
}

// ============================== LOGIN VIEW =============================
function LoginView({
  googleBtnId,
  handleLogin,
  handleFacebook,
  handleLinkedIn,
  loginData,
  setLoginData,
  validLogin,
  error,
  setIsSignUp,
  setIsResetStep,
  setResetStep,
  setError,
  setSlide,
}) {
  return (
    <>
      <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center md:text-left">
        Sign In
      </h2>

      <div className="flex justify-center md:justify-start gap-4 mb-6">
        <SocialButtons
          googleBtnId={googleBtnId}
          setError={setError}
          handleFacebook={handleFacebook}
          handleLinkedIn={handleLinkedIn}
        />
      </div>

      <p className="text-gray-500 text-sm mb-6">or use your account</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <FloatingInput
          label="Email or Username"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />

        <PasswordField
          label="Password"
          simple={true}
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />

        <div className="text-right -mt-1">
          <button
            type="button"
            onClick={() => {
              setSlide("slide-left");
              setTimeout(() => {
                setIsResetStep(true);
                setResetStep(1);
                setError("");
                setSlide("slide-center");
              }, 450);
            }}
            className="text-emerald-600 underline text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!validLogin}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            validLogin
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          SIGN IN
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignUp(true)}
          className="underline text-emerald-600"
        >
          Create an account
        </button>
      </div>
    </>
  );
}
