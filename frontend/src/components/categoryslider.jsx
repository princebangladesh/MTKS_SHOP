import Slider from "react-slick";
import React from "react";
import "./categoryslider.css";
import Loader from "./shared/loader";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

function Categoryslider() {
  const navigate = useNavigate();

  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "10px",
        },
      },
    ],
  };

  const [CatSliData, setCatSliData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${BASE_URL}/catslider/`)
      .then((res) => res.json())
      .then((data) => {
        setCatSliData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container px-4 sm:px-6 md:px-8" 
    data-aos="fade-right"
    data-aos-delay="200"
    >
      <div className="max-w-7xl mx-auto py-6 sm:py-8">

        <Slider {...settings}>
          {CatSliData.map((src, index) => (
            <div
              key={index}
              className="px-2 sm:px-4 outline-none focus:outline-none cursor-pointer"
              onClick={() => navigate(`/category/${src.slug}`)}
            >
              <div className="flex flex-col items-center">

                {/* Category Circle */}
                <div
                  className="
                  relative overflow-hidden rounded-full
                  bg-[linear-gradient(63deg,_#DADDEB_0%,_#EDF0F2_100%)]
                  dark:Caro-bg
                  w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 
                  transition-transform duration-300 ease-in-out
                  hover:scale-105
                "
                >
                  <img
                    src={src.popular_image}
                    alt={src.name}
                    className="
                    absolute inset-0 m-auto 
                    w-full h-full object-cover rounded-full
                  "
                  />
                </div>

                {/* Category Name */}
                <h3 className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-center dark:text-brandWhite">
                  {src.name}
                </h3>

              </div>
            </div>
          ))}
        </Slider>

      </div>
    </div>
  );
}

export default Categoryslider;
