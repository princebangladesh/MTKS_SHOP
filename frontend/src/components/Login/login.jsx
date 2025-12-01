// ========================= IMPORTS =========================
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ResetPasswordSteps from "./ResetPasswordSteps";
import SignupSteps from "./SignupSteps";
import FloatingInput from "./FloatingInput";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";

import { GOOGLE_CLIENT_ID } from "../../config";
import { useLoader } from "../shared/loaderContext";
import { useAuth } from "../shared/authContext";
import { useWishlist } from "../shared/wishlistcontext";
import { useCart } from "../shared/cartContext";

import api from "../../config/axios";
import "./login.css";

const LoginSkeleton = React.lazy(() => import("../skeleton/LoginSkeleton"));

// ============================================================
// ========================== MAIN ============================
// ============================================================
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

  // ---------------- LOGIN STATES ----------------
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [validLogin, setValidLogin] = useState(false);

  // ---------------- SIGNUP STATES ----------------
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signupPasswordStrength, setSignupPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  const [usernameExists, setUsernameExists] = useState(null);
  const [emailExists, setEmailExists] = useState(null);

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [validSignup, setValidSignup] = useState(false);

  const [signupStep, setSignupStep] = useState(1);
  const [signupCountdown, setSignupCountdown] = useState(5);

  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // ============================================================
  // =============== PASSWORD STRENGTH FUNCTION =================
  // ============================================================
  const scorePassword = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: "Weak" };

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak";
    if (score >= 4) label = "Strong";
    else if (score === 3) label = "Medium";

    return { score, label };
  };

  // ============================================================
  // ======================= VALIDATIONS =========================
  // ============================================================
  useEffect(() => {
    setValidLogin(
      loginData.email.trim().length > 3 &&
      loginData.password.trim().length >= 6
    );
  }, [loginData]);

  useEffect(() => {
    setValidSignup(
      signupData.first_name.length >= 2 &&
      signupData.last_name.length >= 2 &&
      signupData.username.length >= 3 &&
      signupData.email.length >= 5 &&
      signupData.password.length >= 6 &&
      signupData.password === signupData.confirmPassword &&
      usernameExists === false && // FALSE = AVAILABLE
      emailExists === false       // FALSE = AVAILABLE
    );
  }, [signupData, usernameExists, emailExists]);

  // ============================================================
  // =================== REDIRECT IF LOGGED IN ==================
  // ============================================================
  useEffect(() => {
    if (isAuthenticated) navigate("/user");
  }, [isAuthenticated]);

  // ============================================================
  // ======================== GOOGLE INIT ========================
  // ============================================================
  useEffect(() => {
    const init = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      const btn = document.getElementById("realGoogleBtn");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: 200,
        });
      }
    };

    const t = setTimeout(init, 400);
    return () => clearTimeout(t);
  }, []);

  // ============================================================
  // ===================== GOOGLE CALLBACK ======================
  // ============================================================
  const handleGoogleCredential = async (response) => {
    const idToken = response.credential;
    if (!idToken) return setError("Google login failed");

    setLoading(true);

    try {
      const res = await api.post("/api/auth/google/", { id_token: idToken });

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

  // ============================================================
  // ========================== SHAKE ============================
  // ============================================================
  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 400);
  };

  // ============================================================
  // ===================== FETCH FUNCTIONS ======================
  // ============================================================
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

  // ============================================================
  // ======================= LOGIN HANDLER =======================
  // ============================================================
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

  // ============================================================
  // ==================== USERNAME CHECK =========================
  // ============================================================
  useEffect(() => {
    if (signupData.username.length < 3) {
      setUsernameExists(null);
      return;
    }

    setCheckingUsername(true);

    const delay = setTimeout(async () => {
      try {
        const res = await api.get("/check-user/", {
          params: { username: signupData.username },
        });

        // BACKEND RETURNS:
        // username_exists = true  → TAKEN
        // username_exists = false → AVAILABLE
        setUsernameExists(res.data.username_exists);

      } catch {
        setUsernameExists(true); // assume taken on error
      }

      setCheckingUsername(false);
    }, 3000);

    return () => clearTimeout(delay);
  }, [signupData.username]);

  // ============================================================
  // ===================== EMAIL CHECK ===========================
  // ============================================================
  useEffect(() => {
    if (signupData.email.length < 5) {
      setEmailExists(null);
      return;
    }

    setCheckingEmail(true);

    const delay = setTimeout(async () => {
      try {
        const res = await api.get("/check-user/", {
          params: { email: signupData.email },
        });

        setEmailExists(res.data.email_exists);

      } catch {
        setEmailExists(true);
      }

      setCheckingEmail(false);
    }, 3000);

    return () => clearTimeout(delay);
  }, [signupData.email]);
  // ============================================================
  // ==================== SIGNUP SUBMIT ==========================
  // ============================================================
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

      // Move to Step 2 animation
      setSlide("slide-right");
      setTimeout(() => {
        setSignupStep(2);
        setSignupCountdown(5);
        setSlide("slide-center");
      }, 450);

    } catch (err) {
      if (err.response?.data?.email) {
        setEmailExists(true);
        setError("❌ Email already exists");
      } else if (err.response?.data?.username) {
        setUsernameExists(true);
        setError("❌ Username already taken");
      } else {
        setError("Signup failed");
      }
      triggerShake();
    }

    setLoading(false);
  };

  // ============================================================
  // ==================== SIGNUP COUNTDOWN =======================
  // ============================================================
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

  // ============================================================
  // ======================== RETURN JSX =========================
  // ============================================================
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100 dark:bg-black">

        {/* HIDDEN GOOGLE BUTTON ANCHOR */}
        <div
          id="realGoogleBtn"
          style={{
            opacity: 0,
            pointerEvents: "none",
            width: "200px",
            height: "50px",
            position: "absolute",
            left: "-9999px",
          }}
        ></div>

        <div
          className={`auth-shell w-full max-w-5xl bg-white dark:bg-neutral-900 
          rounded-3xl shadow-xl
          ${isSignUp ? "signup-mode" : "signin-mode"}
          ${shakeForm ? "animate-shake" : ""}`}
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

            {/* LOGIN / RESET PANEL */}
            <div className="form-box signin slide-container">
              <div className={`slide-panel ${slide}`}>
                {!isResetStep ? (
                  <LoginView
                    googleBtnId="realGoogleBtn"
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
                    resetMessage={resetMessage}
                    setResetMessage={setResetMessage}
                    setLoading={setLoading}
                    setIsResetStep={setIsResetStep}
                    setSlide={setSlide}
                  />
                )}
              </div>
            </div>

            {/* SIGNUP PANEL */}
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
                scorePassword={scorePassword}  // <<< IMPORTANT FIX
              />
            </form>

          </div>
        </div>

      </div>
    </Suspense>
  );
}

export default Login;


// ======================================================================
// ============================= LEFT PANEL =============================
// ======================================================================
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

        <p className="opacity-90 mb-8 text-sm text-white max-w-xs">
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
          className="px-10 py-3 border border-white rounded-full text-white font-semibold hover:bg-white hover:text-emerald-600 transition"
        >
          {isSignUp ? "SIGN IN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
}


// ======================================================================
// =============================== LOGIN VIEW ===========================
// ======================================================================
function LoginView({
  googleBtnId,
  handleLogin,
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
      <h2 className="text-3xl font-bold text-emerald-600 mb-6">Sign In</h2>

      <div className="flex justify-center md:justify-start gap-4 mb-6">
        <SocialButtons googleBtnId={googleBtnId} setError={setError} />
      </div>

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
