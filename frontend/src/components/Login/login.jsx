// ========================= IMPORTS =========================
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import ResetPasswordSteps from "./ResetPasswordSteps";
import SignupSteps from "./SignupSteps";

import FloatingInput from "./FloatingInput";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";

import { LINKEDIN_CLIENT_ID } from "../../config";
import { useLoader } from "../shared/loaderContext";
import { useAuth } from "../shared/authContext";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";

import api from "../../config/axios";
import "./login.css";
import { BASE_URL } from "../../config/api";

const LoginSkeleton = React.lazy(() => import("../skeleton/LoginSkeleton"));
const LINKEDIN_REDIRECT_URI = "/login";

// ======================================================================
//                           MAIN LOGIN COMPONENT
// ======================================================================

function Login() {
  const { setLoading } = useLoader();
  const { isAuthenticated, setToken } = useAuth();
  const { setWishlist } = useWishlist();
  const { setCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/user";

  // UI STATES
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetStep, setIsResetStep] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [slide, setSlide] = useState("slide-center");
  const [shakeForm, setShakeForm] = useState(false);
  const [error, setError] = useState("");

  // LOGIN FORM
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [validLogin, setValidLogin] = useState(false);

  // SIGNUP FORM
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

  // Signup step + countdown
  const [signupStep, setSignupStep] = useState(1);
  const [signupCountdown, setSignupCountdown] = useState(5);

  // RESET PASSWORD
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailExists, setResetEmailExists] = useState(null);
  const [resetMessage, setResetMessage] = useState("");

  // ======================================================================
  //                           VALIDATIONS
  // ======================================================================

  // LOGIN VALIDATION
  useEffect(() => {
    setValidLogin(
      loginData.email.trim().length > 3 &&
      loginData.password.trim().length >= 6
    );
  }, [loginData]);

  // SIGNUP VALIDATION
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

  // AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated, navigate]);

  // LIVE EMAIL CHECK
  useEffect(() => {
    if (!signupData.email || signupData.email.length < 5) {
      setEmailExists(null);
      return;
    }

    setCheckingEmail(true);

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`${BASE_URL}/check-user/?email=${signupData.email}`);
        setEmailExists(res.data.email_exists);
      } catch {
        setEmailExists(null);
      }
      setCheckingEmail(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [signupData.email]);

  // LIVE USERNAME CHECK
  useEffect(() => {
    if (!signupData.username || signupData.username.length < 3) {
      setUsernameExists(null);
      return;
    }

    setCheckingUsername(true);

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`${BASE_URL}/check-user/?username=${signupData.username}`);
        setUsernameExists(res.data.username_exists);
      } catch {
        setUsernameExists(null);
      }
      setCheckingUsername(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [signupData.username]);

  // RESET PASSWORD CHECK
  useEffect(() => {
    if (!resetEmail || resetEmail.length < 5) {
      setResetEmailExists(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`${BASE_URL}/check-user/?email=${resetEmail}`);
        setResetEmailExists(res.data.email_exists);
      } catch {
        setResetEmailExists(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [resetEmail]);

  // SHAKE ANIMATION
  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 400);
  };

  // ======================================================================
  //                           PASSWORD STRENGTH
  // ======================================================================

  const scorePassword = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak" };
    if (score === 2) return { score, label: "Okay" };
    if (score === 3) return { score, label: "Strong" };
    return { score, label: "Very Strong" };
  };

  // ======================================================================
  //                           LOGIN HANDLER
  // ======================================================================

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

  // ======================================================================
  //                           SIGNUP HANDLER
  // ======================================================================

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

  // ======================================================================
  //                      SIGNUP COUNTDOWN TRANSITION
  // ======================================================================

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

    const t = setTimeout(() => {
      setSignupCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(t);

  }, [signupStep, signupCountdown]);

  // ======================================================================
  //                      GOOGLE LOGIN (FINAL FIX)
  // ======================================================================

  const handleGoogleSuccess = async (response) => {
    setLoading(true);

    try {
      const res = await api.post("/api/auth/google/", {
        id_token: response.credential,
      });

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

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google login failed"),
    flow: "implicit",
  });

  // ======================================================================
  //                         FACEBOOK LOGIN
  // ======================================================================

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
      setError("Facebook login failed");
      triggerShake();
    }

    setLoading(false);
  };

  // ======================================================================
  //                         LINKEDIN LOGIN
  // ======================================================================

  const handleLinkedInLogin = () => {
    window.location.href =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
      `&scope=r_liteprofile%20r_emailaddress`;
  };

  // ======================================================================
  //                             RENDER UI
  // ======================================================================

  return (
    <>
      <Suspense fallback={<LoginSkeleton />}>
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100 dark:bg-black">

          <div
            className={`
              auth-shell w-full max-w-5xl bg-white dark:bg-neutral-900
              rounded-3xl shadow-xl
              ${isSignUp ? "signup-mode" : "signin-mode"}
              ${shakeForm ? "animate-shake" : ""}
            `}
          >

            {/* LEFT SIDE */}
            <LeftPanel
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              setIsResetStep={setIsResetStep}
              setResetStep={setResetStep}
              setSlide={setSlide}
            />

            {/* RIGHT SIDE */}
            <div className="side side-form">

              {/* LOGIN / RESET */}
              <div className="form-box signin slide-container">
                <div className={`slide-panel ${slide}`}>

                  {!isResetStep ? (
                    <LoginView
                      googleLogin={googleLogin}
                      handleGoogleSuccess={handleGoogleSuccess}
                      handleFacebook={handleFacebookResponse}
                      handleLinkedIn={handleLinkedInLogin}
                      handleLogin={handleLogin}
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
                  scorePassword={scorePassword}
                  signupPasswordStrength={signupPasswordStrength}
                  setSignupPasswordStrength={setSignupPasswordStrength}
                  handleSignup={handleSignup}
                  validSignup={validSignup}
                  error={error}
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
    </>
  );
}

export default Login;

// ======================================================================
//                           LEFT PANEL COMPONENT
// ======================================================================

function LeftPanel({
  isSignUp,
  setIsSignUp,
  setIsResetStep,
  setResetStep,
  setSlide,
}) {
  return (
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

// ======================================================================
//                           LOGIN VIEW COMPONENT
// ======================================================================

function LoginView({
  googleLogin,
  handleLogin,
  handleFacebook,
  handleLinkedIn,
  handleGoogleSuccess,
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
          googleLogin={googleLogin}
          handleGoogleSuccess={handleGoogleSuccess}
          handleFacebook={handleFacebook}
          handleLinkedIn={handleLinkedIn}
          setError={setError}
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
            className="text-emerald-600 underline hover:text-emerald-700 text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-red-500 text-sm fade-in">{error}</p>}

        <button
          type="submit"
          disabled={!validLogin}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            validLogin
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
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
    </>
  );
}
