import React, { useState, useEffect } from "react";
import api from "./UserProfile/api";
import { useCart } from "./shared/cartContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const [shipping, setShipping] = useState({
    street: "",
    apt: "",
    state: "",
    zip: "",
  });

  /* --------------------------------------------------
     FETCH PROFILE
  -------------------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("profile/");
        const profile = res.data;

        const parseAddress = (addr) => {
          if (!addr) return { street: "", apt: "", state: "", zip: "" };
          const p = addr.split(",");
          return {
            street: p[0]?.trim() ?? "",
            apt: p[1]?.trim() ?? "",
            state: p[2]?.trim() ?? "",
            zip: p[3]?.trim() ?? "",
          };
        };

        setUserInfo({
          first_name: profile.user?.first_name || "",
          last_name: profile.user?.last_name || "",
          email: profile.user?.email || "",
          phone_number: profile.phone_number || "",
        });

        setShipping(parseAddress(profile.shipping_address));
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* --------------------------------------------------
     HANDLE INPUT
  -------------------------------------------------- */
  const input = (e, group) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (!group)
      setUserInfo((p) => ({ ...p, [name]: value }));
    else
      setShipping((p) => ({ ...p, [name]: value }));
  };

  /* --------------------------------------------------
     VALIDATION
     Adds red borders to empty fields
  -------------------------------------------------- */
  const validateStep1 = () => {
    let err = {};
    const req = (v) => v && String(v).trim() !== "";

    if (!req(userInfo.first_name)) err.first_name = true;
    if (!req(userInfo.last_name)) err.last_name = true;
    if (!req(userInfo.email)) err.email = true;
    if (!req(userInfo.phone_number)) err.phone_number = true;

    if (!req(shipping.street)) err.street = true;
    if (!req(shipping.state)) err.state = true;
    if (!req(shipping.zip)) err.zip = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const goNext = () => {
    if (validateStep1()) setStep(2);
  };

  const goBack = () => setStep(1);

  /* --------------------------------------------------
     PLACE ORDER
  -------------------------------------------------- */
  const handlePlaceOrder = async () => {
    const makeAddress = (a) =>
      `${a.street}, ${a.apt}, ${a.state}, ${a.zip}`;

    const items = cart.map((item) => ({
      variant_id:
        item.variant_id ??
        item.variant?.id ??
        item.default_variant_id ??
        null,
      product_id:
        item.variant?.product?.id ??
        item.product?.id ??
        null,
      quantity: item.quantity,
      price:
        parseFloat(item.variant?.price) ||
        parseFloat(item.product?.current_price) ||
        0,
    }));

    const payload = {
      shipping_address: makeAddress(shipping),
      billing_address: makeAddress(shipping),
      total_price: subtotal,
      items,
    };

    try {
      const res = await api.post("/orders/", payload);
      clearCart();
      navigate(`/order-success/${res.data.order_id}`);
    } catch (err) {
      console.error("Order failed:", err.response?.data);
      alert("Order failed!");
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading checkout...</div>;

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center py-10 px-4">
      <div className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">

        {/* Horizontal Sliding Wrapper */}
        <div
          className="flex w-[200%] transition-transform duration-700"
          style={{
            transform: step === 1 ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          {/* --------------------------------------------------
             STEP 1 — SHIPPING FORM
          -------------------------------------------------- */}
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Shipping Details
            </h2>

            {/* CONTACT NAME */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                name="first_name"
                placeholder="First Name"
                value={userInfo.first_name}
                onChange={input}
                className={`border p-2 rounded dark:bg-gray-700 dark:text-white ${
                  errors.first_name ? "border-red-500" : ""
                }`}
              />

              <input
                name="last_name"
                placeholder="Last Name"
                value={userInfo.last_name}
                onChange={input}
                className={`border p-2 rounded dark:bg-gray-700 dark:text-white ${
                  errors.last_name ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* EMAIL */}
            <input
              name="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={input}
              className={`border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white ${
                errors.email ? "border-red-500" : ""
              }`}
            />

            {/* PHONE */}
            <input
              name="phone_number"
              placeholder="Phone Number"
              value={userInfo.phone_number}
              onChange={input}
              className={`border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white ${
                errors.phone_number ? "border-red-500" : ""
              }`}
            />

            {/* SHIPPING ADDRESS */}
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Shipping Address
            </h3>

            <input
              name="street"
              placeholder="Street Address"
              value={shipping.street}
              onChange={(e) => input(e, "ship")}
              className={`border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white ${
                errors.street ? "border-red-500" : ""
              }`}
            />

            <div className="grid grid-cols-3 gap-3 mb-4">
              <input
                name="apt"
                placeholder="Apt / Suite (optional)"
                value={shipping.apt}
                onChange={(e) => input(e, "ship")}
                className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                name="state"
                placeholder="State"
                value={shipping.state}
                onChange={(e) => input(e, "ship")}
                className={`border p-2 rounded dark:bg-gray-700 dark:text-white ${
                  errors.state ? "border-red-500" : ""
                }`}
              />
              <input
                name="zip"
                placeholder="ZIP"
                value={shipping.zip}
                onChange={(e) => input(e, "ship")}
                className={`border p-2 rounded dark:bg-gray-700 dark:text-white ${
                  errors.zip ? "border-red-500" : ""
                }`}
              />
            </div>

            <button
              onClick={goNext}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Continue to Review →
            </button>
          </div>

          {/* --------------------------------------------------
             STEP 2 — REVIEW ORDER
          -------------------------------------------------- */}
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Review & Place Order
            </h2>

            {/* CART ITEMS */}
            <div className="space-y-4">
              {cart.map((item, i) => {
                const name =
                  item?.product?.name ||
                  item?.variant?.product?.name ||
                  "Product";

                const image =
                  item?.variant?.image ||
                  item?.product?.image1 ||
                  item?.product?.image ||
                  "https://placehold.co/80x80?text=No+Image";

                const price =
                  parseFloat(item?.variant?.price) ||
                  parseFloat(item?.product?.current_price) ||
                  0;

                const qty = item.quantity;

                return (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-4 border-b dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded border dark:border-gray-700 object-cover"
                      />

                      <div>
                        <p className="font-medium dark:text-white">{name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Qty: {qty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold dark:text-white">
                        ${price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: ${(price * qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTALS */}
            <div className="text-right mt-6 dark:text-gray-200">
              <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
              <p>Tax (10%): <strong>${tax.toFixed(2)}</strong></p>
              <p className="text-xl mt-2">
                Grand Total: <strong>${total.toFixed(2)}</strong>
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
              <button
                onClick={goBack}
                className="px-5 py-2 border rounded dark:text-white dark:border-gray-600"
              >
                ← Back
              </button>

              <button
                onClick={handlePlaceOrder}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
