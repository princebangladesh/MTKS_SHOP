import React, { useState } from "react";

function Parallax() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="
        relative overflow-hidden 
        h-[60vh] md:h-[70vh] 
        flex items-center justify-center 
        bg-gradient-to-br 
        from-[#d4ffe8] to-[#b8ffd1] 
        dark:from-[#062c30] dark:to-[#013135]
      "
    >
      {/* ⭐ FLOATING BUBBLE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 45}px`,
              height: `${20 + Math.random() * 45}px`,
              animationDuration: `${4 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>

      {/* ⭐ CENTER CONTENT */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-brandGreen dark:text-white drop-shadow">
          Subscribe to Our Newsletter
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-7 max-w-lg mx-auto leading-relaxed">
          Get exclusive deals, product drops, and updates straight to your inbox.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="
              max-w-lg mx-auto flex 
              bg-white dark:bg-neutral-900
              rounded-full shadow-lg
              overflow-hidden border border-white/40
              backdrop-blur-sm
              transition
            "
          >
            <input
              type="email"
              required
              placeholder="Enter your email..."
              className="
                flex-grow px-5 py-3 
                bg-transparent text-gray-800 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-300
                focus:outline-none
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="
                px-6 py-3
                bg-brandGreen text-white font-semibold
                hover:bg-green-700 
                transition-all
                rounded-r-full
              "
            >
              Subscribe
            </button>
          </form>
        ) : (
          <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
            🎉 Thank you for subscribing!
          </p>
        )}
      </div>

      {/* ⭐ BUBBLE CSS */}
      <style>{`
        .bubble {
          position: absolute;
          bottom: -70px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          animation: rise linear infinite;
          filter: blur(1px);
        }

        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(1.4);
            opacity: 0;
          }
        }

        /* Dark Mode Bubbles */
        .dark .bubble {
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Parallax;
