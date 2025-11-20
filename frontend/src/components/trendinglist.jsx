import ProductList from "./productlist";

import React from 'react'
import { useLoader } from "./shared/loaderContext";
import { BASE_URL } from "../config/api";


function TrendingList() {
  const { loading, setLoading } = useLoader();
      const [ProductData, setProductData] = React.useState([]);
      React.useEffect(() => {
      // Replace this with your actual API URL
      fetch(`${BASE_URL}/tr_product_full/`)
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
    <div>
      {ProductData.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No products found for this brand.</div>
      ) : (
        <ProductList products={ProductData} />
      )}
    </div>
  )
}

export default TrendingList