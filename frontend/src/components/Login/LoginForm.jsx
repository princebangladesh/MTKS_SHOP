import React, { useState } from "react";
import FloatingInput from "./FloatingInput";
import PasswordSimple from "./PasswordSimple";

function LoginForm({
  error,
  setError,
  triggerShake,
  SocialButtons,
  googleBtnRef,
  handleFacebookResponse,
  handleLinkedInLogin,
}) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const validLogin =
    loginData.email.trim().length > 3 &&
    loginData.password.trim().length >= 6;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validLogin) return;

    // Trigger the parent logic
    const formEvent = new CustomEvent("LOGIN_SUBMIT", {
      detail: { loginData },
    });
    window.dispatchEvent(formEvent);
  };

  return (
    <form onSubmit={handleLogin} className="fade-in">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Sign In</h2>

      <SocialButtons
        googleBtnRef={googleBtnRef}
        setError={setError}
        handleFacebook={handleFacebookResponse}
        handleLinkedIn={handleLinkedInLogin}
      />

      <FloatingInput
        label="Email Address"
        type="email"
        value={loginData.email}
        onChange={(e) =>
          setLoginData({ ...loginData, email: e.target.value })
        }
      />

      <PasswordSimple
        label="Password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
      />

      {error && <p className="text-red-500 text-sm mb-3 fade-in">{error}</p>}

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
  );
}

export default LoginForm;
