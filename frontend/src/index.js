import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@flaticon/flaticon-uicons/css/all/all.css';
import { CartProvider } from './components/shared/cartContext';
import { LoaderProvider } from './components/shared/loaderContext';
import AuthProvider from './components/shared/authContext';
import { WishlistProvider } from './components/shared/wishlistcontext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <LoaderProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </LoaderProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
