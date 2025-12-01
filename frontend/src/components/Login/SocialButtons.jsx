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
  const triggerGoogle = () => {
    setError("");

    const root = document.getElementById(googleBtnId);
    if (!root) {
      setError("Google button not ready");
      return;
    }

    // Try to find the real rendered Google button
    let btn = root.querySelector("div[role='button'], button");

    // If not found → try forcing Google to re-render
    if (!btn && window.google) {
      window.google.accounts.id.renderButton(root, {
        theme: "outline",
        size: "large",
        width: 200,
      });

      // Retry after DOM updates
      setTimeout(() => {
        const retryBtn = root.querySelector("div[role='button'], button");
        if (retryBtn) retryBtn.click();
        else setError("Google still loading… try again");
      }, 150);

      return;
    }

    // Button exists → click it
    if (btn) btn.click();
    else setError("Google button not ready");
  };

  return (
    <div className="flex gap-6 items-center">

      {/* GOOGLE */}
      <AnimatedSocialButton
        color="#DB4437"
        onClick={triggerGoogle}
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
        onClick={() => {
          setError("");
          handleLinkedIn();
        }}
        icon={<FaLinkedin className="text-lg" />}
      />
    </div>
  );
}
