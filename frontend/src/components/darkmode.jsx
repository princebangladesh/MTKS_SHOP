import React from 'react'
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
function DarkModeToggle() {
  const [theme, setTheme] = React.useState("light");
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button className='pr-3 hidden lg:block' onClick={toggleTheme}>
      {
        theme==="light" ? 
        <MdOutlineDarkMode className="text-brandGreen font-semibold text-2xl"/>:
        <CiLight className='text-brandWhite font-semibold text-2xl'/>

      }
    </button>
  )
}

export default DarkModeToggle;