import React from 'react'

function Button({text,bgColor,textColor,handler=()=>{}}) {
  return (
    <button className={`relative ${bgColor} ${textColor} cursor-pointer hover:scale-105 duration-300 py-2 px-8 rounded-full z-10`}>{text}</button>
  )
}

export default Button;