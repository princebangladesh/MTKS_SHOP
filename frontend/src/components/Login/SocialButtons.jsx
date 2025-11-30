import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import AnimatedSocialButton from "./AnimatedSocialButton";

export default function SocialButtons({
  setError,
  handleFacebook,
  handleLinkedIn,
  handleGoogleSuccess,
}) {


  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google login failed"),
    flow: "implicit",
  });

  return (
    <div className="flex gap-6 mb-6 justify-center md:justify-start items-center">

      {/* GOOGLE */}
      <AnimatedSocialButton
        color="#DB4437"
        onClick={() => {
          setError("");
          googleLogin(); 
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
