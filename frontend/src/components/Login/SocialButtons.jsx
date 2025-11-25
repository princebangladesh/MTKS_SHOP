import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa6";

/* ------------------------------
   Animated Social Button Wrapper
------------------------------ */
const AnimatedButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center justify-center 
      p-4 rounded-full border border-gray-300 dark:border-gray-500
      bg-white/80 dark:bg-neutral-800/80 
      shadow-sm transition-all duration-300
      hover:scale-125 hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]
      active:scale-95
    "
    style={{ color }}
  >
    {icon}
  </button>
);

/* ------------------------------
    Social Buttons Row Component
------------------------------ */
function SocialButtons({
  googleBtnRef,
  handleFacebook,
  handleLinkedIn,
  setError,
}) {
  return (
    <div className="flex gap-6 mb-6 justify-center items-center">

      {/* GOOGLE BUTTON (custom animated icon triggers hidden button) */}
      <AnimatedButton
        color="#DB4437"
        icon={
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
        }
        onClick={() => {
          setError("");
          googleBtnRef.current
            ?.querySelector("div[role='button']")
            ?.click();
        }}
      />

      {/* FACEBOOK LOGIN */}
      <FacebookLogin
        appId="1960201038102026"
        fields="name,email,picture"
        callback={handleFacebook}
        render={(props) => (
          <AnimatedButton
            color="#1877F2"
            icon={<FaFacebookF className="text-lg" />}
            onClick={() => {
              setError("");
              props.onClick();
            }}
          />
        )}
      />

      {/* LINKEDIN */}
      <AnimatedButton
        color="#0A66C2"
        icon={<FaLinkedin className="text-lg" />}
        onClick={() => {
          setError("");
          handleLinkedIn();
        }}
      />
    </div>
  );
}

export default SocialButtons;
