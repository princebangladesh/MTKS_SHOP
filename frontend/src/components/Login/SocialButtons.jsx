import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import AnimatedSocialButton from "./AnimatedSocialButton";

export default function SocialButtons({
  googleBtnRef,
  triggerGoogleLogin,
  setError,
  handleFacebook,
  handleLinkedIn,
  handleGoogleSuccess,
}) {
  return (
    <div className="flex gap-6 items-center">

      {/* Google */}
      <AnimatedSocialButton
        color="#DB4437"
        onClick={() => {
          setError("");
          triggerGoogleLogin();
        }}
        icon={
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
        }
      />

      {/* Facebook */}
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

      {/* LinkedIn */}
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
