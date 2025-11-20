const API = {
  BASE_URL: "https://backend-broken-cloud-4726.fly.dev",
  AUTH: {
    LOGIN: "/api/token/",
    SIGNUP: "/api/auth/registration/",
    GOOGLE: "/api/auth/google/",
    FACEBOOK: "/api/auth/facebook/",
    LINKEDIN: "/api/auth/linkedin/",
  },
  USER: {
    WISHLIST: "/api/wishlist/",
    CART: "/api/cart-items/",
  }
};

export const BASE_URL = API.BASE_URL;
export default API;
