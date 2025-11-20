import React from 'react'
import {useState,useEffect} from 'react'
import ProductList from "./productlist";
import Loader from "./shared/loader";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config/api';

function BrandListProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/brand/${slug}/products/`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [slug]);
  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No products found for this brand.</div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  )
}

export default BrandListProduct