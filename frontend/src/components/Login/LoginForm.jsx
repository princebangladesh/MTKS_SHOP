import React from "react";
import FloatingInput from "./FloatingInput";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";

function LoginForm({
  loginData,
  setLoginData,
  handleLogin,
  validLogin,
  googleBtnRef,
  handleGoogleSuccess,
  handleFacebook,
  handleLinkedIn,
  error,
  setError,
  setIsResetStep,
  setResetStep,
  setSlide,
  setIsSignUp,
}) {
  return (
    <div className="login-form animate-fade">
      <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center md:text-left">
        Sign In
      </h2>

      {/* SOCIAL BUTTONS */}
      <div className="flex justify-center md:justify-start gap-4 mb-6">
        <SocialButtons
          googleBtnRef={googleBtnRef}
          handleFacebook={handleFacebook}
          handleLinkedIn={handleLinkedIn}
          handleGoogleSuccess={handleGoogleSuccess}
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
            className="text-emerald-600 underline hover:text-emerald-700 text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

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
    </div>
  );
}

export default LoginForm;
