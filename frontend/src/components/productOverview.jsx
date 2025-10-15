import React, { useState, useEffect } from 'react';
import ProductOverView from './shared/productView';
import { useParams } from 'react-router-dom';
import ProductOverviewSkeleton from './skeleton/prdouctOverviewSkeleton';

function ProductOverview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Local loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError(null);

    // Optional: Simulate a minimum load time for UX (e.g. 1.5s)
    const delay = new Promise((resolve) => setTimeout(resolve, 1500));

    Promise.all([
      fetch(`http://127.0.0.1:8000/productlist/${id}/`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch product');
          return res.json();
        })
        .then((data) => setProduct(data))
        .catch((err) => {
          console.error('Fetch error:', err);
          setError('Failed to load product. Please try again.');
        }),
      delay
    ]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductOverviewSkeleton />;

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
      </div>
    );
  }

  return <ProductOverView product={product} />;
}

export default ProductOverview;
