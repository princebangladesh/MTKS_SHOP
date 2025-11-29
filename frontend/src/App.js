
import './App.css';
import Home from './home.jsx';

import Navbar from './components/navbar.jsx';

import Footer from './components/footer.jsx';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from './components/productlist.jsx';
import ProductOverView from './components/productOverview.jsx';
import Contact from './components/contact.jsx';
import About from './components/about.jsx';
import Cart from './components/cart.jsx';
import TrendingList from './components/trendinglist.jsx';
import FeaturedList from './components/featuredlist.jsx';
import WishlistPage from './components/wishlist.jsx';
import BrandListProduct from './components/brandListProduct.jsx';
import CategoryList from './components/categorylist.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import CheckoutPage from './components/checkout.jsx';
import OrderSuccessPage from './components/orderSuccessPage.jsx';
import OrderList from './components/UserProfile/OrderList.jsx';
import OrderDetails from './components/UserProfile/orderdetails.jsx';
import Shop from './components/shop.jsx';
import Login from './components/Login/login.jsx';
import ResetPassword from './components/Login/ResetPassword.jsx';
import VerifyEmail from './components/Login/VerifyEmail.jsx';
import FAQ from './components/Faq.jsx';
import ScrollToTop from './components/shared/ScrollToTop.jsx';
function App() {
  return (
    <Router>
      
      <div className='dark:bg-black scroll-smooth bg-brandWhite-200'>
      <ScrollToTop/>
      <Navbar/>
      <Routes>
      <Route path="" element={<Home />} />
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
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      <Route path="/orders/:orderId" element={<OrderDetails />} />
      <Route path="/my-orders" element={<OrderList />} />
      <Route path="/brands/:slug" element={<BrandListProduct />} />
      <Route path="/category/:slug" element={<CategoryList />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/faq" element={<FAQ />} />

      
      
      </Routes>
      

      </div>
    <Footer/>
    </Router>
  );
}

export default App;
