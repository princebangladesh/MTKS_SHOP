import React, { useEffect, useState } from "react";
import { useLoader } from "../shared/loaderContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";

function ResetPassword() {
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const uid = params.get("uid");
  const token = params.get("token");

  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleValidate = async () => {
    const res = await api.get(
      `/api/auth/password-reset/validate/?uid=${uid}&token=${token}`
    );
    setValid(res.data.valid);
  };

  useEffect(() => {
    handleValidate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/password-reset/confirm/", {
        uid,
        token,
        password,
      });

      setMessage(res.data.detail);
      setTimeout(() => navigate("/login"), 2000);

    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  if (!valid)
    return (
      <p className="text-center text-red-600 mt-40">
        Invalid or expired password reset link
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-8 shadow-lg">

        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Reset Password
        </h2>

        {message && <p className="text-emerald-600 mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NEW PASSWORD */}
          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg 
              dark:text-white text-black outline-none border-gray-500/40
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
            <label
              className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 
              transition-all duration-300 pointer-events-none
              ${password ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
              group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-emerald-500`}
            >
              New Password
            </label>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative group">
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 pt-5 pb-2 bg-transparent border rounded-lg 
              dark:text-white text-black outline-none border-gray-500/40
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
            <label
              className={`absolute left-4 px-1 bg-white dark:bg-neutral-900 
              transition-all duration-300 pointer-events-none
              ${confirm ? "-top-3 text-xs font-semibold" : "top-3 text-gray-400"}
              group-focus-within:-top-3 group-focus-within:text-xs group-focus-within:text-emerald-500`}
            >
              Confirm Password
            </label>
          </div>

          <button
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white 
            rounded-lg font-semibold transition shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
