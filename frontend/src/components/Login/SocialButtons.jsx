import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import AnimatedSocialButton from "./AnimatedSocialButton";

export default function SocialButtons({
  googleBtnId,
  setError,
  handleFacebook,
  handleLinkedIn,
}) {
  return (
    <div className="flex gap-6 items-center">

      {/* GOOGLE */}
      <AnimatedSocialButton
        color="#DB4437"
        onClick={() => {
          setError("");
          const btn = document
            .getElementById(googleBtnId)
            .querySelector("div[role='button'], button");

          if (btn) btn.click();
          else setError("Google button not ready");
        }}
        icon={
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
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
        onClick={() => {
          setError("");
          handleLinkedIn();
        }}
        icon={<FaLinkedin className="text-lg" />}
      />
    </div>
  );
}
