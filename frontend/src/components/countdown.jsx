import React from "react";
import watch2 from '../assets/hero/watch2.png'
import Timer from "./timer";



const timerConfig = {
  "title": "Limited Time Offer",
  "deadline": "2026-08-31T23:59:59",
};
const slides = [
  
      {
    title: "Tree Runner NZ",
    desc: "Minimal, modern, and miraculously comfortable.",
    image: "https://placehold.co/600x400",
    model: "https://placehold.co/600x400",
  },
  {
    title: "Canvas Piper",
    desc: "A comfy, casual, warm weather classic.",
    image: "https://placehold.co/600x400",
    model: "https://placehold.co/600x400",
  },
];

const Countdown = () => {


  return (
    <div className="container">
   
    <div className="flex items-center justify-center min-h-[300px] py-5  ">
      <div className="container text-brandBlue dark:text-brandWhite bg-brandWhite dark:bg-brandBlue rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center ">
        <div className="p-6 sm:p-8 justify-center items-center md:items-start lg:items-start flex flex-col">
          <p className="text-xl font-bold py-1 ">30% off</p>
          <p className="text-4xl uppercase lg:text-5xl font-bold ">Runner NZ</p>
          <p className="text-sm mt-5 ">Minimal, modern, and miraculously comfortable.</p>
        </div>
        <div className="h-full flex items-center justify-center overflow-hidden">
          <img src={watch2} alt="" className=" scale-125 w-250 md:w-[340px]"/>
        </div>
        
        <Timer config={timerConfig} />
        

        </div>
      </div>
    </div>
       
    </div>
  );
};
export default Countdown;