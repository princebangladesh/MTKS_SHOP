import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { motion } from "framer-motion";

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const uid = params.get("uid");
  const token = params.get("token");

  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.get(
          `/api/verify-email/?uid=${uid}&token=${token}`
        );

        setStatus("success");
        setMessage(res.data.detail);

        setTimeout(() => navigate("/login"), 2500);
      } catch (error) {
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-neutral-900 max-w-md w-full p-8 rounded-xl shadow-lg text-center"
      >
        {status === "loading" && (
          <>
            <div className="loader mb-4 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="text-gray-500 mt-2">Redirecting to login...</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
 