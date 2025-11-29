// ======================================================================
// ============================= SIGNUP VIEW =============================
// ======================================================================
function SignupView({
  signupData,
  setSignupData,
  scorePassword,
  signupPasswordStrength,
  setSignupPasswordStrength,
  handleSignup,
  validSignup,
  error,
  emailExists,
  usernameExists,
  checkingEmail,
  checkingUsername,
  setIsSignUp,
}) {
  return (
    <div className="form-box signup">
      <h2 className="text-3xl font-bold text-emerald-600 mb-6">
        Create Account
      </h2>

      {/* FIRST & LAST NAME */}
      <div className="flex gap-4 mb-4">
                <FloatingInput
          label="First Name"
          type="text"
          value={signupData.first_name}
          onChange={(e) => setSignupData({ ...signupData, first_name: e.target.value })}
        />


        <FloatingInput
          label="Last Name"
          type="text"
          value={signupData.last_name}
          onChange={(e) =>
            setSignupData({ ...signupData, last_name: e.target.value })
          }
        />
      </div>

      {/* USERNAME */}
      <FloatingInput
        label="Username"
        type="text"
        value={signupData.username}
        onChange={(e) => { ... }}
        status={
          checkingUsername ? "checking"
          : usernameExists === true ? "error"
          : usernameExists === false ? "success"
          : null
        }
      />


      {/* USERNAME FEEDBACK */}
      {checkingUsername && (
        <p className="text-gray-500 text-sm mb-2">⏳ Checking username…</p>
      )}
      {usernameExists === true && (
        <p className="text-red-500 text-sm mb-2">❌ Username already taken</p>
      )}
      {usernameExists === false && signupData.username.length >= 3 && (
        <p className="text-emerald-600 text-sm mb-2">✓ Username available</p>
      )}

      {/* EMAIL */}
      <FloatingInput
        label="Email Address"
        type="email"
        value={signupData.email}
        onChange={(e) =>
          setSignupData({ ...signupData, email: e.target.value })
        }
      />

      {/* EMAIL FEEDBACK */}
      {checkingEmail && (
        <p className="text-gray-500 text-sm mb-2">⏳ Checking email…</p>
      )}
      {emailExists === true && (
        <p className="text-red-500 text-sm mb-2">❌ Email already exists</p>
      )}
      {emailExists === false && signupData.email.length >= 5 && (
        <p className="text-emerald-600 text-sm mb-2">✓ Email available</p>
      )}

      {/* PASSWORD */}
      <PasswordField
        label="Password"
        value={signupData.password}
        onChange={(e) => {
          const v = e.target.value;
          setSignupData({ ...signupData, password: v });
          setSignupPasswordStrength(scorePassword(v));
        }}
        strength={signupPasswordStrength}
      />

      {/* CONFIRM PASSWORD */}
      <PasswordConfirmField
        label="Confirm Password"
        password={signupData.password}
        value={signupData.confirmPassword}
        onChange={(e) =>
          setSignupData({
            ...signupData,
            confirmPassword: e.target.value,
          })
        }
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        disabled={
          !validSignup ||
          emailExists === true ||
          usernameExists === true ||
          checkingEmail ||
          checkingUsername
        }
        className={`w-full py-3 rounded-lg font-semibold transition ${
          !validSignup ||
          emailExists === true ||
          usernameExists === true ||
          checkingEmail ||
          checkingUsername
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        SIGN UP
      </button>

      <div className="mobile-auth-link text-center mt-4">
        <button
          onClick={() => setIsSignUp(false)}
          className="underline text-emerald-600"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
