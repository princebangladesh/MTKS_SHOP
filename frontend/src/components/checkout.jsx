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
  const [order, setOrder] = useState(null);

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

    if (!group) setUserInfo((p) => ({ ...p, [name]: value }));
    else setShipping((p) => ({ ...p, [name]: value }));
  };

  /* --------------------------------------------------
     VALIDATION
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
     PLACE ORDER → STEP 3 THEN STEP 4
  -------------------------------------------------- */
  const handlePlaceOrder = async () => {
    setStep(3); // Show "Processing..."

    setTimeout(async () => {
      const makeAddress = (a) => `${a.street}, ${a.apt}, ${a.state}, ${a.zip}`;

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
        setOrder(res.data);

        setStep(4); // Move to final step
      } catch (err) {
        console.error("Order failed:", err.response?.data);
        alert("Order failed!");
        setStep(2);
      }
    }, 2000);
  };

  if (loading)
    return <div className="text-center p-10">Loading checkout...</div>;

  /* --------------------------------------------------
     UI SLIDER (4 STEPS → 400%)
  -------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center py-10 px-4">
      <div className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">

        {/* Slider Wrapper */}
        <div
          className="flex w-[400%] transition-transform duration-700"
          style={{
            transform:
              step === 1 ? "translateX(0%)" :
              step === 2 ? "translateX(-25%)" :
              step === 3 ? "translateX(-50%)" :
              "translateX(-75%)",
          }}
        >

          {/* --------------------------------------------------
              STEP 1 — SHIPPING FORM
          -------------------------------------------------- */}
          <div className="w-1/4 p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Shipping Details
            </h2>

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

            <input
              name="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={input}
              className={`border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white ${
                errors.email ? "border-red-500" : ""
              }`}
            />

            <input
              name="phone_number"
              placeholder="Phone Number"
              value={userInfo.phone_number}
              onChange={input}
              className={`border p-2 rounded w-full mb-4 dark:bg-gray-700 dark:text-white ${
                errors.phone_number ? "border-red-500" : ""
              }`}
            />

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
                placeholder="Apt / Suite"
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
          <div className="w-1/4 p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Review & Place Order
            </h2>

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

            <div className="text-right mt-6 dark:text-gray-200">
              <p>
                Subtotal: <strong>${subtotal.toFixed(2)}</strong>
              </p>
              <p>
                Tax (10%): <strong>${tax.toFixed(2)}</strong>
              </p>
              <p className="text-xl mt-2">
                Grand Total: <strong>${total.toFixed(2)}</strong>
              </p>
            </div>

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

          {/* --------------------------------------------------
              STEP 3 — PROCESSING (2 SECONDS)
          -------------------------------------------------- */}
          <div className="w-1/4 p-8 flex flex-col items-center justify-center">
            <svg
              className="w-20 h-20 animate-spin text-blue-600 mb-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>

            <h2 className="text-2xl font-bold dark:text-white mb-2">
              Processing Your Order...
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              Please wait a moment.
            </p>
          </div>

          {/* --------------------------------------------------
              STEP 4 — SUCCESS
          -------------------------------------------------- */}
          <div className="w-1/4 p-8 flex flex-col items-center justify-center text-center">
            <svg
              className="w-20 h-20 text-green-600 mb-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
              />
            </svg>

            <h2 className="text-2xl font-bold dark:text-white mb-2">
              Order Placed Successfully!
            </h2>

            {order && (
              <div className="bg-green-50 border p-4 rounded-lg text-left w-full max-w-sm mb-6">
                <p>
                  <strong>Order ID:</strong> #{order.order_id}
                </p>
                <p>
                  <strong>Total:</strong> $
                  {Number(order.total_price).toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {order.status_display}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Items:</strong> {order.items?.length}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
