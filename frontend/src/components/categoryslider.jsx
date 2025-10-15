import Slider from "react-slick";
import React from 'react'
import './categoryslider.css';
import Loader from "./shared/loader";
import { Link,useNavigate } from "react-router-dom";


function Categoryslider() {
  const navigate = useNavigate();
  const settings = {
    autoplay:true,
    dots:false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,

        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,

        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };
    const [CatSliData, setCatSliData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
    // Replace this with your actual API URL
    fetch('http://127.0.0.1:8000/catslider/')
      .then(res => res.json())
      .then(data => {
        setCatSliData(data);
        setLoading(false);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
      <div className="container">
    <div className="max-w-7xl mx-auto px-8 py-8 md:min-w-6xl ">
      <Slider {...settings}>
        {CatSliData.map((src, index) => (
          <div key={index} className="px-4 outline-none focus:outline-none cursor-pointer">
            <div onClick={() => navigate(`/category/${src.slug}`)}>
            <div className="relative bg-[linear-gradient(63deg,_#DADDEB_0%,_#EDF0F2_100%)] dark:Caro-bg overflow-hidden catgory-slider rounded-full w-40 h-40">

            <img
              src={src.popular_image}
              alt={src.name}
              className="absolute w-40 h-40 mx-auto rounded-full transition duration-500"
            />
            </div>

            
            <h3 className="mt-4 text-base sm:text-lg font-bold dark:text-brandWhite text-center font-sans">
              {src.name}
            </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    </div>
  )
}

export default Categoryslider;