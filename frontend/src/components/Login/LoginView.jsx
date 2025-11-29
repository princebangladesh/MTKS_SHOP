// LoginView.jsx
import React from "react";
import FloatingInput from "./inputs/FloatingInput";
import PasswordField from "./inputs/PasswordField";
import SocialButtons from "./social/SocialButtons";

export default function LoginView({
  googleBtnRef,
  handleLogin,
  handleFacebook,
  handleGoogleSuccess,
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

      {/* SOCIAL LOGIN BUTTONS */}
      <div className="flex justify-center md:justify-start gap-4 mb-6">
        <SocialButtons
          googleBtnRef={googleBtnRef}
          setError={setError}
          handleFacebook={handleFacebook}
          handleLinkedIn={handleLinkedIn}
          handleGoogleSuccess={handleGoogleSuccess}
        />
      </div>

      <p className="text-gray-500 text-center md:text-left text-sm mb-6">
        or use your account
      </p>

      {/* LOGIN FORM */}
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
