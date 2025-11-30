import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const Toast = ({ message, title, type = "success", onClose }) => {
  const [visible, setVisible] = useState(false);

  const hideTimer = useRef();
  const removeTimer = useRef();

  useEffect(() => {
    setVisible(true);

    hideTimer.current = setTimeout(() => setVisible(false), 2000);

    removeTimer.current = setTimeout(() => onClose(), 3300);

    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, [onClose]);

  const closeInstant = () => {
    clearTimeout(hideTimer.current);
    clearTimeout(removeTimer.current);
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    info: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  };

  const borders = {
    success: "border-green-500",
    error: "border-red-500",
    info: "border-yellow-500",
  };

  const barColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-yellow-500",
  };

  const bounceAndProgressCSS = `
    @keyframes toastBounce {
      0%   { transform: translateX(120%); }
      60%  { transform: translateX(-6%); }
      80%  { transform: translateX(2%); }
      100% { transform: translateX(0); }
    }

    @keyframes toastProgress {
      from { width: 100%; }
      to   { width: 0%; }
    }
  `;

  const toastUI = (
    <>
      <style>{bounceAndProgressCSS}</style>

      <div
        className={`
          fixed z-[9999]
          top-4 right-4
          w-[90%] max-w-xs sm:max-w-sm
          bg-white dark:bg-gray-900
          shadow-xl rounded-md border-l-4
          p-4 flex flex-col gap-3
          ${borders[type]}

          transition-all duration-500 ease-out
          ${visible ? "opacity-100" : "opacity-0 translate-x-full"}
          ${visible ? "animate-[toastBounce_0.6s_ease]" : ""}
        `}
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-start gap-3">
          <div className="pt-1">{icons[type]}</div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>

          <button
            onClick={closeInstant}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
          <div
            className={`${barColors[type]} h-full`}
            style={{
              animation: "toastProgress 2s linear forwards",
            }}
          />
        </div>
      </div>
    </>
  );

  return createPortal(toastUI, document.body);
};

export default Toast;
