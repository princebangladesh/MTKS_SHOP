import React from "react";
import FloatingInput from "./FloatingInput";
import api from "../../config/axios";

export default function ResetPasswordSteps({
  resetStep,
  setResetStep,
  resetEmail,
  setResetEmail,
  resetEmailExists,
  resetMessage,
  setResetMessage,
  setLoading,
  setIsResetStep,
  setSlide,
}) {
  // STEP 1 — EMAIL ENTRY
  if (resetStep === 1) {
    return (
      <>
        <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
          Reset Password
        </h2>

        {resetMessage && (
          <p className="text-red-500 text-center mb-2">{resetMessage}</p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (resetEmailExists === false) {
              setResetMessage("Email not found");
              return;
            }

            setLoading(true);
            try {
              await api.post("/api/auth/password-reset/", {
                email: resetEmail,
              });

              setSlide("slide-left");
              setTimeout(() => {
                setResetStep(2);
                setSlide("slide-center");
              }, 450);
            } catch {
              setResetMessage("Something went wrong");
            }

            setLoading(false);
          }}
          className="space-y-4"
        >
          <FloatingInput
            label="Enter your email"
            type="email"
            value={resetEmail}
            onChange={(e) => {
              setResetMessage("");
              setResetEmail(e.target.value);
            }}
          />

          {resetEmailExists === false && (
            <p className="text-red-500 text-sm">❌ Email not found</p>
          )}

          {resetEmailExists === true && (
            <p className="text-emerald-600 text-sm">✓ Email found</p>
          )}

          <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
            Send Reset Link
          </button>
        </form>

        <button
          onClick={() => {
            setSlide("slide-right");
            setTimeout(() => {
              setIsResetStep(false);
              setResetStep(1);
              setResetMessage("");
              setSlide("slide-center");
            }, 450);
          }}
          className="underline text-emerald-600 mt-6 block text-center"
        >
          ← Back to Sign In
        </button>
      </>
    );
  }

  // STEP 2 — EMAIL SENT
  if (resetStep === 2) {
    return (
      <>
        <h2 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
          Email Sent!
        </h2>

        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-4xl text-emerald-600">✓</span>
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          We’ve sent a password reset link to <b>{resetEmail}</b>
        </p>

        <button
          onClick={() => {
            setSlide("slide-right");
            setTimeout(() => {
              setIsResetStep(false);
              setResetStep(1);
              setSlide("slide-center");
            }, 450);
          }}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
        >
          Back to Sign In
        </button>
      </>
    );
  }

  return null;
}
