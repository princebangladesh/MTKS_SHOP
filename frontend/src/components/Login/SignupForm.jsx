import React, { useState } from "react";
import FloatingInput from "./FloatingInput";
import PasswordField from "./PasswordField"; // advanced password field with strength meter
import SocialButtons from "./SocialButtons";

import api from "../../config/axios";

function SignupForm({
  error,
  setError,
  triggerShake,
  googleBtnRef,
  handleFacebookResponse,
  handleLinkedInLogin,
}) {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [strength, setStrength] = useState({ score: 0, label: "" });
  const [validSignup, setValidSignup] = useState(false);

  /* -------- Password Strength Scoring -------- */
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

  /* -------- Live validation -------- */
  const validateSignup = (updated) => {
    const basicValid =
      updated.name.trim().length >= 3 &&
      updated.email.trim().length > 3 &&
      updated.password.trim().length >= 6;

    const passwordMatch = updated.password === updated.confirm;

    setValidSignup(basicValid && passwordMatch);
  };

  /* -------- Input Change Handler -------- */
  const onInputChange = (field, value) => {
    const updated = { ...signupData, [field]: value };

    if (field === "password") {
      const st = scorePassword(value);
      setStrength(st);
    }
    if (field === "confirm") {
      // trigger match validation
    }

    setSignupData(updated);
    validateSignup(updated);
  };

  /* -------- Signup Request -------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validSignup) return;

    setError("");

    try {
      await api.post("/api/auth/registration/", {
        username: signupData.email,
        email: signupData.email,
        password1: signupData.password,
        password2: signupData.password,
        name: signupData.name,
      });

      window.location.reload(); // return to Sign In
    } catch {
      triggerShake();
      setError("Signup failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSignup} className="animate-fade">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Create Account</h2>

      <SocialButtons
        googleBtnRef={googleBtnRef}
        handleFacebook={handleFacebookResponse}
        handleLinkedIn={handleLinkedInLogin}
      />

      <FloatingInput
        label="Full Name"
        type="text"
        value={signupData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
      />

      <FloatingInput
        label="Email Address"
        type="email"
        value={signupData.email}
        onChange={(e) => onInputChange("email", e.target.value)}
      />

      <PasswordField
        label="Password"
        value={signupData.password}
        onChange={(e) => onInputChange("password", e.target.value)}
        strength={strength}
      />

      <FloatingInput
        label="Confirm Password"
        type="password"
        value={signupData.confirm}
        onChange={(e) => onInputChange("confirm", e.target.value)}
      />

      {signupData.confirm.length > 0 &&
        signupData.confirm !== signupData.password && (
          <p className="text-red-500 text-xs mt-1 animate-fade">
            Passwords do not match
          </p>
        )}

      {error && (
        <p className="text-red-500 text-sm mb-3 animate-fade">{error}</p>
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
  );
}

export default SignupForm;
