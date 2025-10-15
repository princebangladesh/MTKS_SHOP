import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Jane Doe",
    role: "CEO, Example Company",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  {
    name: "June Doe",
    role: "CEO, Example Company",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  {
    name: "John Doe",
    role: "CEO, Example Company",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  {
    name: "Jane Doe",
    role: "CEO, Example Company",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  {
    name: "June Doe",
    role: "CEO, Example Company",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  {
    name: "John Doe",
    role: "CEO, Example Company",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
];

const TestimonialSlider = () => {
  const settings = {
    autoplay: true,
    arrow:false,
    speed: 500,
    autoplaySpeed: 3500,
    infinite: true,
    slidesToShow: 3, // Adjust for responsiveness
    slidesToScroll: 1,
    arrows: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="container">

    <div className="max-w-6xl mx-auto px-8 py-10">
    <h2 className="text-center text-2xl font-bold mb-6 text-dark dark:text-brandWhite mb-8">What Our Customers Say</h2>

      <Slider {...settings}>
        {testimonials.map((t, idx) => (
          <div key={idx} className="px-3">
            <div className="bg-white dark:bg-black rounded-lg shadow p-6 h-full  hover:shadow-2xl transition-shadow duration-500">
                  <div className="flex items-center space-x-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold dark:text-white">{t.name}</p>
                  <div className="flex text-yellow-500 text-sm mb-1">
                  {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < t.rating ? "★" : "☆"}</span>
                  ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm  dark:text-gray-300 mt-4">"{t.text}"</p>
              
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </div>

  );
};

export default TestimonialSlider;