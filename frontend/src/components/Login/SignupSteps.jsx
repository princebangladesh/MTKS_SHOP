import React from "react";
import SignupView from "./SignupView";

export default function SignupSteps({
  signupStep,
  signupData,
  setSignupData,
  scorePassword,
  signupPasswordStrength,
  setSignupPasswordStrength,
  validSignup,
  error,
  emailExists,
  usernameExists,
  checkingEmail,
  checkingUsername,
  setIsSignUp,
  setSlide,
  countdown,
}) {
  // ============================================================
  // STEP 2 — SUCCESS SCREEN
  // ============================================================
  if (signupStep === 2) {
    return (
      <div className="form-box signup">
        <h2 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
          Account Created!
        </h2>

        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-4xl text-emerald-600">✓</span>
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-1">
          Verification email sent to:
        </p>

        <p className="text-center font-semibold mb-5">
          {signupData.email}
        </p>

        <p className="text-center text-sm text-gray-500 mb-6">
          Redirecting in <b>{countdown}</b> seconds...
        </p>

        <button
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          onClick={() => {
            setSlide("slide-right");
            setTimeout(() => {
              setIsSignUp(false);
            }, 450);
          }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  // ============================================================
  // STEP 1 — SIGNUP FORM (MAIN FORM)
  // ============================================================
  return (
    <SignupView
      signupData={signupData}
      setSignupData={setSignupData}
      scorePassword={scorePassword}
      signupPasswordStrength={signupPasswordStrength}
      setSignupPasswordStrength={setSignupPasswordStrength}
      validSignup={validSignup}
      error={error}
      emailExists={emailExists}
      usernameExists={usernameExists}
      checkingEmail={checkingEmail}
      checkingUsername={checkingUsername}
      setIsSignUp={setIsSignUp}
      setSlide={setSlide}
    />
  );
}
