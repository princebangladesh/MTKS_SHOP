import React from 'react'
import { FaCartPlus } from "react-icons/fa";
import ProductLand from './shared/lanproduct';
import { Link,useNavigate } from 'react-router-dom';
import { useLoader } from './shared/loaderContext';
import { BASE_URL } from '../config/api';

function Trending() {
  const navigate = useNavigate();
  const NavigateClick = () => {
    navigate(`/trending`);
  };
const [ProductData, setProductData] = React.useState([]);
  const { setLoading } = useLoader();
    React.useEffect(() => {
    // Replace this with your actual API URL
    fetch(`${BASE_URL}/tr_product/`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        setLoading(false);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
          <div className="flex justify-between items-center mt-20 mb-12 px-4">
            <h2 className="featured-title sm:text-4xl md:text-3xl font-semibold text-dark dark:text-brandWhite border-b-[6px] border-brandGreen dark:border-brandWhite pb-2">Trending Products</h2>
            <div className="link-view text-lg text-blue-500 pr-2 font-bold text-brandBlue dark:text-brandWhite hover:tracking-widest transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => NavigateClick("trending")} >View All</div>
          </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
      
     {ProductData.map((item) => <ProductLand key={item.id} product={item} />)}

    </div>
        </div>
  )
}

export default Trending