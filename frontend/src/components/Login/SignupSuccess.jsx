// SignupSuccess.jsx
import React from "react";

export default function SignupSuccess({ email, setIsSignUp, setSignupStep }) {
  return (
    <div className="form-box signup text-center">
      <h2 className="text-3xl font-bold text-emerald-600 mb-4">
        Verify Your Email
      </h2>

      {/* ICON */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-4xl text-emerald-600">✉️</span>
        </div>
      </div>

      {/* MESSAGE */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 px-4 leading-relaxed">
        We’ve sent a verification link to:  
        <br />
        <b>{email}</b>
        <br />
        Please check your inbox to activate your account.
      </p>

      {/* BACK BUTTON */}
      <button
        onClick={() => {
          setSignupStep(1);
          setIsSignUp(false);
        }}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
      >
        Back to Sign In
      </button>
    </div>
  );
}
