import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import AnimatedSocialButton from "./AnimatedSocialButton";

export default function SocialButtons({
  googleBtnRef,
  setError,
  handleFacebook,
  handleLinkedIn,
  handleGoogleSuccess,
}) {
  return (
    <div className="flex gap-6 mb-6 justify-center md:justify-start items-center">
      
      {/* GOOGLE */}
      <AnimatedSocialButton
        color="#DB4437"
        onClick={() => {
          setTimeout(() => setError(""), 100);
          const btn = googleBtnRef.current?.querySelector("div[role='button']");
          if (btn) btn.click();
        }}
        icon={
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
        }
      />

      {/* FACEBOOK */}
      <FacebookLogin
        appId="1960201038102026"
        fields="name,email,picture"
        callback={handleFacebook}
        render={(props) => (
          <AnimatedSocialButton
            color="#1877F2"
            onClick={() => {
              setError("");
              props.onClick();
            }}
            icon={<FaFacebookF className="text-lg" />}
          />
        )}
      />

      {/* LINKEDIN */}
      <AnimatedSocialButton
        color="#0A66C2"
        onClick={handleLinkedIn}
        icon={<FaLinkedin className="text-lg" />}
      />
    </div>
  );
}
