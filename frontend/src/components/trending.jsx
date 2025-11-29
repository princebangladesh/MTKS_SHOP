import React from 'react'
import ProductLand from './shared/lanproduct';
import { useNavigate } from 'react-router-dom';
import { useLoader } from './shared/loaderContext';
import { BASE_URL } from '../config/api';

function Trending() {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [ProductData, setProductData] = React.useState([]);

  const NavigateClick = () => navigate(`/trending`);

  React.useEffect(() => {
    fetch(`${BASE_URL}/tr_product/`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching Trending products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">

      {/* HEADER */}
      <div className="flex justify-between items-center mt-20 mb-12 px-4">
        <h2 className="featured-title sm:text-4xl md:text-3xl font-semibold text-dark dark:text-brandWhite border-b-[6px] border-brandGreen dark:border-brandWhite pb-2">
          Trending Products
        </h2>

        <div
          className="text-lg font-bold text-brandBlue dark:text-brandWhite cursor-pointer hover:tracking-widest transition-all duration-300"
          onClick={NavigateClick}
        >
          View All
        </div>
      </div>

      {/* STRICT GRID: ALWAYS 2 cols or 4 cols */}
      <div
        className="
          grid 
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-2
          lg:grid-cols-4
          xl:grid-cols-4
          gap-5
        "
      >
        {ProductData.map(item => (
          <ProductLand key={item.id} product={item} />
        ))}
      </div>
      
    </div>
  );
}

export default Trending;
