import React from 'react'
import './featured.css'
import ProductLand from './shared/lanproduct';
import { useLoader } from './shared/loaderContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/api';

function Featured() {
  const navigate = useNavigate();
  const NavigateClick = () => navigate(`/featured`);

  const [ProductData, setProductData] = React.useState([]);
  const { setLoading } = useLoader();

  React.useEffect(() => {
    fetch(`${BASE_URL}/fr_product/`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="flex justify-between items-center mt-20 mb-12 px-4">
        <h2 className="featured-title sm:text-4xl md:text-3xl font-semibold text-dark dark:text-brandWhite border-b-[6px] border-brandGreen dark:border-brandWhite pb-2">
          Featured Products
        </h2>

        <div
          className="text-lg font-bold text-brandBlue dark:text-brandWhite cursor-pointer hover:tracking-widest transition-all duration-300"
          onClick={NavigateClick}
        >
          View All
        </div>
      </div>

      {/* STRICT GRID: 2 → 2 → 4 (NEVER 3) */}
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

export default Featured;
