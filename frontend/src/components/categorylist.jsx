import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductList from './productlist';
import ProductListSkeleton from './skeleton/productlistskeleton';

function CategoryList() {
  const { slug } = useParams();
  const location = useLocation();

  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);


    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/category/${slug}/products/`);
        if (!response.ok) throw new Error('Failed to fetch category products');
        const data = await response.json();

        console.log("Fetched data:", data);

        // ✅ Handle different API response shapes
        let products = [];
        if (Array.isArray(data)) {
          products = data; // API returns an array
        } else if (data.results) {
          products = data.results; // API returns { results: [...] }
        } else if (data.products) {
          products = data.products; // API returns { products: [...] }
        }

        if (isMounted) setCatData(products);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load products for this category.');
      } finally {
        setLoading(false)
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false; // cleanup
    };
  }, [slug, location.key]);

  if (loading) return <ProductListSkeleton />;

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
      </div>
    );
  }

  return catData.length === 0 ? (
    <div className="text-center text-gray-500 mt-10 mb-[300px]">
      No products found for this brand.
    </div>
  ) : (
    <ProductList products={catData} />
  );
}

export default CategoryList;
