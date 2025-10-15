import { useEffect, useState,useRef } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Toast = ({ message,title, type, onClose }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  const timer = useRef();
  const cleanup = useRef();

  useEffect(() => {
    timer.current = setTimeout(() => setFadeOut(true), 3000);
    cleanup.current = setTimeout(() => onClose(), 7000);
    return () => {
      clearTimeout(timer.current);
      clearTimeout(cleanup.current);
    };
  }, [onClose]);

  const ManualClose=()=>{
    clearTimeout(timer.current)
    clearTimeout(cleanup.current)
    onClose()
  }

  const colors = {
    success: {
      bg: 'bg-white',
      border: 'border-green-500',
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-500',
      iconColor: 'text-red-500',
    },
    info: {
      bg: 'bg-white',
      border: 'border-yellow-500',
      iconColor: 'text-yellow-500',
    },
  };

  const { bg, border, iconColor } = colors[type] || colors.success;

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 w-full max-w-sm shadow-lg rounded-md
        flex items-start border-l-4 p-4 space-x-3 transition-all duration-500
        ${bg} ${border} ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Icon */}
      <div className="pt-1">
        <CheckCircleIcon className={`h-6 w-6 ${iconColor}`} />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      {/* Close button */}
      <button onClick={ManualClose} className="text-gray-400 hover:text-gray-600">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;