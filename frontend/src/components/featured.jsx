import React from 'react'
import './featured.css'
import ProductLand from './shared/lanproduct';
import { useLoader } from './shared/loaderContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/api';


function Featured() {
  const navigate = useNavigate();
  const NavigateClick = () => {
    navigate(`/featured`);
  };
  const [ProductData, setProductData] = React.useState([]);
  const { setLoading } = useLoader();
    React.useEffect(() => {
    // Replace this with your actual API URL
    fetch(`${BASE_URL}/fr_product/`)
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
        <h2 className="featured-title sm:text-4xl md:text-3xl font-semibold text-dark dark:text-brandWhite border-b-[6px] border-brandGreen dark:border-brandWhite pb-2">Featured Products</h2>
        <div className="link-view text-lg text-blue-500 pr-2 font-bold text-brandBlue dark:text-brandWhite hover:tracking-widest transition-all duration-300 ease-in-out cursor-pointer"
         onClick={() => NavigateClick("featured")} >View All</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ProductData.map((item) => <ProductLand key={item.id} product={item} />)}
  </div>
  </div>
  )
}

export default Featured