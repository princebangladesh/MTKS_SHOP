import React from 'react';
import ProductList from './productlist';
import { BASE_URL } from '../config/api';

function FeaturedList() {
  const [productData, setProductData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${BASE_URL}/fr_product_full/`)
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading products...</div>;
  }

  return (
    <div>
      {productData.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No products found for this brand.
        </div>
      ) : (
        <ProductList products={productData} />
      )}
    </div>
  );
}

export default FeaturedList;
