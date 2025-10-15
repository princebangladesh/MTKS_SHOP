
import './App.css';
import Home from './home.jsx';

import Navbar from './components/navbar.jsx';

import Footer from './components/footer.jsx';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from './components/productlist.jsx';
import ProductOverView from './components/productOverview.jsx';
import Contact from './components/contact.jsx';
import About from './components/about.jsx';
import Login from './components/login.jsx';
import Cart from './components/cart.jsx';
import TrendingList from './components/trendinglist.jsx';
import FeaturedList from './components/featuredlist.jsx';
import WishlistPage from './components/wishlist.jsx';
import BrandListProduct from './components/brandListProduct.jsx';
import CategoryList from './components/categorylist.jsx';
import TestGoogleLogin from './components/test.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';

function App() {
  return (
    <Router>
      <div className='dark:bg-black scroll-smooth bg-brandWhite-200'>
      <Navbar/>
      <Routes>
      <Route path="" element={<Home />} />
      <Route path="/test" element={< TestGoogleLogin/>} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductOverView />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/trending" element={<TrendingList />} />
      <Route path="/featured" element={<FeaturedList />} />
      <Route path="/user" element={<UserProfile />} />
      <Route path="/brands/:slug" element={<BrandListProduct />} />
      <Route path="/category/:slug" element={<CategoryList />} />
      </Routes>
      

      </div>
    <Footer/>
    </Router>
  );
}

export default App;
