import { useEffect, useState, useRef } from "react";
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

    hideTimer.current = setTimeout(() => setVisible(false), 3000);
    removeTimer.current = setTimeout(() => onClose(), 4000);

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

  return (
    <div
      className={`
        fixed z-50 
        top-3 right-3 
        w-[90%] max-w-xs sm:max-w-sm   /* Mobile friendly width */
        bg-white shadow-lg rounded-md border-l-4 
        p-3 sm:p-4 
        flex items-start gap-3

        transform transition-all duration-500 ease-out
        ${borders[type]}

        ${visible ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-5"}
      `}
    >
      <div className="pt-1">{icons[type]}</div>

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      <button
        onClick={closeInstant}
        className="text-gray-400 hover:text-gray-700 transition"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
