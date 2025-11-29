import React, { useState } from "react";
import { useLoader } from "../shared/loaderContext";
import api from "../../config/axios";

function ForgotPassword() {
  const { setLoading } = useLoader();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    setLoading(true);

    try {
      const res = await api.post("/api/auth/password-reset/", { email });
      setMessage(res.data.detail);
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-8 shadow-lg">

        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Forgot Password
        </h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="email"
              className="w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg 
              dark:text-white text-black outline-none border-gray-500/40
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 
              transition-all duration-300 pointer-events-none
              ${email ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
              group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-emerald-500`}
            >
              Enter your email
            </label>
          </div>

          <button
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700
            text-white rounded-lg font-semibold transition shadow-md"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
