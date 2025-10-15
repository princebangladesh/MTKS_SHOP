import React from 'react'
import {useState,useRef} from 'react'
import { CiFacebook } from "react-icons/ci";
import { GiAutoRepair } from "react-icons/gi";
import { FaRetweet,FaHandHoldingUsd,FaGooglePlusG   } from "react-icons/fa";
import { FaXTwitter,FaPinterest  } from "react-icons/fa6";
import { useCart } from "./cartContext";

import ProductLand from './lanproduct';
import Toast from './toast';



function ProductOverView({product}) {
  const imagelist = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(imagelist[0] || "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart,addToWishlist } = useCart();
    const handleAdd=()=>{
      addToCart(product,quantity)
      showToast('Item Added', product?.name,'success');
    }
  const Relateditems=[{
    id: 1,
      name: "UGreen Wireless Charger",
      image1: "http://127.0.0.1:8000/media/Product/Image/adapter2.png",
      category: "Charger",
      rating: 5,
      price: 45,
      oldPrice: 60
    },{
      id: 2,
      title: "UGreen 25W type-C Cable",
      image1: "http://127.0.0.1:8000/media/Product/Image/cable.png",
      category: "Cable",
      rating: 4,
      price: 30,
      oldPrice: 50
    },{
      id: 3,
      title: "Sony WH-1000XM4 Bluetooth Headphones",
      image1: "http://127.0.0.1:8000/media/Product/Image/headphone.png",
      category: "Headphones",
      rating: 5,
      price: 300,
      oldPrice: 400
    },{
      id: 4,
      title: "Samsung Galaxy earbuds 3",
      image1: "http://127.0.0.1:8000/media/Product/Image/earbud3.png",
      category: "Earbuds",
      rating: 4,
      price: 25,
      oldPrice: 35
    }
  ]

  const colors = [
  { name: "black", code: "bg-black" },
  { name: "green", code: "bg-green-600" },
  { name: "red", code: "bg-red-600" },
  ];
  const [toast, setToast] = useState(null);

  const showToast = (message,title,type) => {
    setToast({ message,title, type });

    setTimeout(() => {
      setToast(null);
    }, 3000); // 3 seconds
  };



  const [quantity, setQuantity] = React.useState(1);
 const handleQuantity = (type) => {
  if (type === 'inc') {
    setQuantity((prev) => prev + 1);
    
  } else {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }
};
  
  
  

  const handleMouseMove = (e) => {
  const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();

    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setHoverPos({ x, y });
  };
  const images=[
    "http://vignette1.wikia.nocookie.net/overwatch/images/b/b7/CuteSprayAvatars-Tracer.png/revision/latest?cb=20160511194930",
    "http://vignette2.wikia.nocookie.net/overwatch/images/8/85/CuteSprayAvatars-Mercy.png/revision/latest?cb=20160511194928",
    "https://www.w3schools.com/howto/img_avatar.png",
  ]
  const sizes=['S', 'M', 'L', 'XL']

  return (
    <div>

    <div className='max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8'>
    <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
  {/* Main Image */}
  <div
    className="relative  overflow-hidden rounded-lg border group w-[400px] h-[400px] cursor-zoom-in"
    onMouseMove={handleMouseMove}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
    ref={imageContainerRef}
  >
    <img
      key={selectedIndex}
      src={imagelist[selectedIndex]}
      className="w-full  h-full object-cover transition-transform duration-300"
      alt="Main product"
    />
    {isHovering && (
      <div
        className="absolute bg-white dark:bg-gray-800 inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${imagelist[selectedIndex]})`,
          backgroundSize: "200%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${hoverPos.x}% ${hoverPos.y}%`,
        }}
      />
    )}
  </div>

  {/* Thumbnails BELOW Main Image */}
  <div className="flex gap-2">
    {imagelist.map((img, i) => (
      <div key={i} className="w-16 h-16 border rounded overflow-hidden">
        <img
          src={img}
          alt="Thumbnail"
          className="object-cover w-full h-full cursor-pointer"
          onClick={() => setSelectedIndex(i)}
        />
      </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Product Details */}
      <div className="w-full lg:w-1/2 space-y-4">
        <h2 className="text-3xl font-semibold dark:text-brandWhite">{product.name}</h2>
        <p className="text-sm text-gray-500">Brand: <a className="text-blue-600" href="#">{product.brand_name}</a></p>

        <div className="flex items-center gap-1">
          <span className="text-yellow-500">{product?.rating}</span>
          <span className="text-sm text-gray-600">(20 reviews)</span>
        </div>

        {/* Pricing */}
        <div className="text-xl font-bold text-green-600">
          ${product.current_price} <span className="line-through text-gray-400 text-base ml-2">${product.previous_price}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm">
          {product?.description}
        </p>

        {/* Color */}
        <div>
          <h4 className="font-bold mb-1 dark:text-brandWhite">Color:</h4>
          <div className="flex gap-2">
           {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-6 h-6 rounded-full ${color.code} border cursor-pointer hover:shadow-md shadow-dark transition ease-in-out duration-300
                  ${selectedColor === color.name ? 'border-4 border-gray-300  ' : ''}`}
              />
            ))}

          </div>
        </div>

        {/* Size */}
        <div>
          <h4 className="font-bold mb-1 dark:text-brandWhite">Size:</h4>
          <div className="flex gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-8 h-8 border rounded hover:shadow-md dark:shadow-white dark:hover:bg-brandWhite dark:hover:text-black transition ease-in-out duration-300
                  ${selectedSize === size ? 'bg-brandGreen text-brandWhite dark:bg-brandWhite dark:text-black font-bold' : 'dark:text-brandWhite text-black'}
                  `}

              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded dark:text-brandWhite dark:hover:bg-brandWhite dark:hover:text-black transition ease-in-out duration-300">
            <button onClick={() => handleQuantity('dec')} className="px-2">-</button>
            <span className="px-4">{quantity}</span>
            <button onClick={() => handleQuantity('inc')} className="px-2">+</button>
          </div>
          <button onClick={handleAdd} 
          className="bg-brandGreen text-white px-6 py-2 rounded hover:bg-brandBlue transition ease-in-out duration-300">
            Add to Cart
          </button>
          {toast && <Toast message={toast.message} type={toast.type} title={toast.title} onClose={()=>setToast(null)} />}
        </div>

        {/* Warranty & Info */}
        <ul className="text-lg text-gray-700 space-y-1">
          <li><GiAutoRepair className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>1 Year AL Jazeera Brand Warranty</li>
          <li><FaRetweet className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>30 Day Return Policy</li>
          <li><FaHandHoldingUsd className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>Cash on Delivery available</li>
        </ul>

        {/* SKU */}
        <ul className="text-xs text-gray-500">
          <li className='my-1'><strong className='text-black dark:text-gray-400'>SKU:</strong> 123456789</li>
          <li className='my-1'><strong className='text-black dark:text-gray-400'>Brand:</strong> Samsung</li>
          <li className='my-1'><strong className='text-black dark:text-gray-400'>Availability: 4 items</strong> In Stock</li>
        
        </ul>

        {/* Share Icons */}
        <div className="flex items-center gap-3 mt-4">
          <span className='dark:text-brandWhite'>Share this on:</span>
          <button className='transition-transform hover:scale-150 duration-300'><CiFacebook className=' text-blue-800 dark:text-blue-500 w-6 h-6 rounded '/></button>
          <button className='transition-transform hover:scale-150  duration-300'><FaXTwitter className=' text-black dark:text-brandWhite w-6 h-6 rounded'/></button>
          <button className='transition-transform hover:scale-150  duration-300'><FaPinterest className='text-red-600 dark:text-red-500 w-6 h-6 rounded' /></button>
          <button className='transition-transform hover:scale-150  duration-300'><FaGooglePlusG className=' text-black dark:text-brandWhite w-6 h-6 rounded'/></button>
        </div>
      
      </div>
    </div>
     <div className="py-10 px-5">
      {/* Tabs Header */}
      <div className="flex space-x-8 border-b">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 font-semibold ${
            activeTab === "description"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-gray-600"
          }`}
        >
          DESCRIPTION
        </button>
        <button
          onClick={() => setActiveTab("additional")}
          className={`pb-2 font-semibold ${
            activeTab === "additional"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-gray-600"
          }`}
        >
          ADDITIONAL INFO
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 font-semibold ${
            activeTab === "reviews"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-gray-600"
          }`}
        >
          REVIEWS (3)
        </button>
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {activeTab === "description" && (
          <p className="dark:text-gray-300">
            This is a high-quality product made from premium materials. It’s designed for comfort and style.
          </p>
        )}

        {activeTab === "additional" && (
          <table className="w-full text-left border mt-4 dark:text-gray-300">
            <tbody>
              <tr className="border-t ">
                <th className="p-2 font-semibold w-1/3 ">Weight</th>
                <td className="p-2">1 kg</td>
              </tr>
              <tr className="border-t">
                <th className="p-2 font-semibold">Dimensions</th>
                <td className="p-2">10 × 10 × 10 cm</td>
              </tr>
              <tr className="border-t border-b">
                <th className="p-2 font-semibold">Color</th>
                <td className="p-2">Black, White</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === "reviews" && (
      <div className="space-y-6 text-gray-700">

        {/* Individual Review */}
        {[
          {
            name: "Jacky Chan",
            date: "December 4, 2020 at 3:12 pm",
            comment: "Thank you very fast shipping from Poland only 3days.",
            rating: 5,
          },
          {
            name: "Ana Rosie",
            date: "December 4, 2020 at 3:12 pm",
            comment: "Great low price and works well.",
            rating: 4,
          },
          {
            name: "Steven Kenny",
            date: "December 4, 2020 at 3:12 pm",
            comment: "Authentic and Beautiful. Love these way more than expected. They are Great earphones.",
            rating: 5,
          },
        ].map((review, i) => (
          <div key={i} className="border-b pb-4">
            <div className="flex items-start gap-4">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png" // Replace with actual avatar or use placeholder
                alt={review.name}
                className="w-10 h-10 rounded-full border"
              />
              <div>
                {/* Stars */}
                <div className="flex text-yellow-500 mb-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <span key={i} className="dark:text-gray-300">★</span>
                  ))}
                </div>

                <p className="text-sm dark:text-gray-300">{review.comment}</p>
                <div className="text-xs font-bold dark:text-gray-200 mt-1">
                  {review.name} · {review.date} · <a href="#" className="text-brandBlue dark:text-brandWhite">Reply</a>
                </div>
              </div>
            </div>
          </div>
        ))}

    {/* Add a Review */}
    <div className="mt-6">
      <h3 className="font-semibold mb-2 text-gray-400">Add a review</h3>
      <form className="space-y-3">
        <textarea
          rows="4"
          className="w-full border rounded p-2 dark:bg-black"
          placeholder="Write Comment"
        ></textarea>
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded p-2 dark:bg-black"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2 dark:bg-black"
        />
        <input
          type="text"
          placeholder="Website"
          className="w-full border rounded p-2 dark:bg-black"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  </div>
)}
      </div>
    </div>

    {/* Related Products section */}
    
    <div className="py-10 px-4 md:px-10">
      <h2 className="text-2xl font-semibold text-center mb-8">Related Product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Relateditems.map((item)=><ProductLand key={item.id} product={item}/>)}
      </div>
    </div>
    </div>
  );
};



export default ProductOverView



// import React from 'react'
// import {useState,useRef} from 'react'
// import { CiFacebook } from "react-icons/ci";
// import { GiAutoRepair } from "react-icons/gi";
// import { FaRetweet,FaHandHoldingUsd,FaGooglePlusG   } from "react-icons/fa";
// import { FaXTwitter,FaPinterest  } from "react-icons/fa6";
// import adapter2 from '../assets/featured/adapter2.png'
// import cable from '../assets/featured/cable.png'
// import headphone from '../assets/featured/headphone.png'
// import earbud3 from '../assets/featured/earbud3.png'
// import ProductLand from './shared/lanproduct';
// import Toast from './shared/toast';



// function ProductOverView() {

//   const Relateditems=[{
//     id: 1,
//       title: "UGreen Wireless Charger",
//       image1: adapter2,
//       category: "Charger",
//       rating: 5,
//       price: 45,
//       oldPrice: 60
//     },{
//       id: 2,
//       title: "UGreen 25W type-C Cable",
//       image1: cable,
//       category: "Cable",
//       rating: 4,
//       price: 30,
//       oldPrice: 50
//     },{
//       id: 3,
//       title: "Sony WH-1000XM4 Bluetooth Headphones",
//       image1: headphone,
//       category: "Headphones",
//       rating: 5,
//       price: 300,
//       oldPrice: 400
//     },{
//       id: 4,
//       title: "Samsung Galaxy earbuds 3",
//       image1: earbud3,
//       category: "Earbuds",
//       rating: 4,
//       price: 25,
//       oldPrice: 35
//     }
//   ]

//   const colors = [
//   { name: "black", code: "bg-black" },
//   { name: "green", code: "bg-green-600" },
//   { name: "red", code: "bg-red-600" },
//   ];
//   const [toast, setToast] = useState(null);

//   const showToast = (message,title,type) => {
//     setToast({ message,title, type });

//     setTimeout(() => {
//       setToast(null);
//     }, 3000); // 3 seconds
//   };



//   const [quantity, setQuantity] = React.useState(1);
//  const handleQuantity = (type) => {
//   if (type === 'inc') {
//     setQuantity((prev) => prev + 1);
    
//   } else {
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
//   }
// };
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);
//   const imageContainerRef = useRef(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [activeTab, setActiveTab] = useState("description");
  
  

//   const handleMouseMove = (e) => {
//   const { left, top, width, height } =
//       imageContainerRef.current.getBoundingClientRect();

//     const x = ((e.pageX - left - window.scrollX) / width) * 100;
//     const y = ((e.pageY - top - window.scrollY) / height) * 100;

//     setHoverPos({ x, y });
//   };
//   const images=[
//     "http://vignette1.wikia.nocookie.net/overwatch/images/b/b7/CuteSprayAvatars-Tracer.png/revision/latest?cb=20160511194930",
//     "http://vignette2.wikia.nocookie.net/overwatch/images/8/85/CuteSprayAvatars-Mercy.png/revision/latest?cb=20160511194928",
//     "https://www.w3schools.com/howto/img_avatar.png",
//   ]
//   const sizes=['S', 'M', 'L', 'XL']

//   return (
//     <div>

//     <div className='max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8'>
//     <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
//   {/* Main Image */}
//   <div
//     className="relative overflow-hidden rounded-lg border group w-[400px] h-[400px] cursor-zoom-in"
//     onMouseMove={handleMouseMove}
//     onMouseEnter={() => setIsHovering(true)}
//     onMouseLeave={() => setIsHovering(false)}
//     ref={imageContainerRef}
//   >
//     <img
//       key={selectedIndex}
//       src={images[selectedIndex]}
//       className="w-full h-full object-cover transition-transform duration-300"
//       alt="Main product"
//     />
//     {isHovering && (
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `url(${images[selectedIndex]})`,
//           backgroundSize: "200%",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: `${hoverPos.x}% ${hoverPos.y}%`,
//         }}
//       />
//     )}
//   </div>

//   {/* Thumbnails BELOW Main Image */}
//   <div className="flex gap-2">
//     {images.map((img, i) => (
//       <div key={i} className="w-16 h-16 border rounded overflow-hidden">
//         <img
//           src={img}
//           alt="Thumbnail"
//           className="object-cover w-full h-full cursor-pointer"
//           onClick={() => setSelectedIndex(i)}
//         />
//       </div>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT: Product Details */}
//       <div className="w-full lg:w-1/2 space-y-4">
//         <h2 className="text-3xl font-semibold dark:text-brandWhite">Brown T-shirt for men</h2>
//         <p className="text-sm text-gray-500">Brand: <a className="text-blue-600" href="#">Samsung</a></p>
        
//         <div className="flex items-center gap-1">
//           <span className="text-yellow-500">★★★★☆</span>
//           <span className="text-sm text-gray-600">(20 reviews)</span>
//         </div>

//         {/* Pricing */}
//         <div className="text-xl font-bold text-green-600">
//           $20.00 <span className="line-through text-gray-400 text-base ml-2">$200.00</span>
//         </div>

//         {/* Description */}
//         <p className="text-gray-600 text-sm">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti
//           reiciendis minima nisi modi.
//         </p>

//         {/* Color */}
//         <div>
//           <h4 className="font-bold mb-1 dark:text-brandWhite">Color:</h4>
//           <div className="flex gap-2">
//            {colors.map((color) => (
//               <button
//                 key={color.name}
//                 onClick={() => setSelectedColor(color.name)}
//                 className={`w-6 h-6 rounded-full ${color.code} border cursor-pointer hover:shadow-md shadow-dark transition ease-in-out duration-300
//                   ${selectedColor === color.name ? 'border-4 border-gray-300  ' : ''}`}
//               />
//             ))}

//           </div>
//         </div>

//         {/* Size */}
//         <div>
//           <h4 className="font-bold mb-1 dark:text-brandWhite">Size:</h4>
//           <div className="flex gap-2">
//             {sizes.map(size => (
//               <button
//                 key={size}
//                 onClick={() => setSelectedSize(size)}
//                 className={`w-8 h-8 border rounded hover:shadow-md dark:shadow-white dark:hover:bg-brandWhite dark:hover:text-black transition ease-in-out duration-300
//                   ${selectedSize === size ? 'bg-brandGreen text-brandWhite dark:bg-brandWhite dark:text-black font-bold' : 'dark:text-brandWhite text-black'}
//                   `}

//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Quantity and Add to Cart */}
//         <div className="flex items-center gap-4">
//           <div className="flex items-center border rounded dark:text-brandWhite dark:hover:bg-brandWhite dark:hover:text-black transition ease-in-out duration-300">
//             <button onClick={() => handleQuantity('dec')} className="px-2">-</button>
//             <span className="px-4">{quantity}</span>
//             <button onClick={() => handleQuantity('inc')} className="px-2">+</button>
//           </div>
//           <button className="bg-brandGreen text-white px-6 py-2 rounded hover:bg-brandBlue transition ease-in-out duration-300">
//             Add to Cart
//           </button>
//           {toast && <Toast message={toast.message} type={toast.type} title={toast.title} onClose={()=>setToast(null)} />}
//         </div>

//         {/* Warranty & Info */}
//         <ul className="text-lg text-gray-700 space-y-1">
//           <li><GiAutoRepair className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>1 Year AL Jazeera Brand Warranty</li>
//           <li><FaRetweet className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>30 Day Return Policy</li>
//           <li><FaHandHoldingUsd className='inline-block text-black text-lg dark:text-brandWhite mr-2 mb-1'/>Cash on Delivery available</li>
//         </ul>

//         {/* SKU */}
//         <ul className="text-xs text-gray-500">
//           <li className='my-1'><strong className='text-black dark:text-gray-400'>SKU:</strong> 123456789</li>
//           <li className='my-1'><strong className='text-black dark:text-gray-400'>Brand:</strong> Samsung</li>
//           <li className='my-1'><strong className='text-black dark:text-gray-400'>Availability: 4 items</strong> In Stock</li>
        
//         </ul>

//         {/* Share Icons */}
//         <div className="flex items-center gap-3 mt-4">
//           <span className='dark:text-brandWhite'>Share this on:</span>
//           <button className='transition-transform hover:scale-150 duration-300'><CiFacebook className=' text-blue-800 dark:text-blue-500 w-6 h-6 rounded '/></button>
//           <button className='transition-transform hover:scale-150  duration-300'><FaXTwitter className=' text-black dark:text-brandWhite w-6 h-6 rounded'/></button>
//           <button className='transition-transform hover:scale-150  duration-300'><FaPinterest className='text-red-600 dark:text-red-500 w-6 h-6 rounded' /></button>
//           <button className='transition-transform hover:scale-150  duration-300'><FaGooglePlusG className=' text-black dark:text-brandWhite w-6 h-6 rounded'/></button>
//         </div>
      
//       </div>
//     </div>
//      <div className="py-10 px-5">
//       {/* Tabs Header */}
//       <div className="flex space-x-8 border-b">
//         <button
//           onClick={() => setActiveTab("description")}
//           className={`pb-2 font-semibold ${
//             activeTab === "description"
//               ? "border-b-2 border-teal-600 text-teal-600"
//               : "text-gray-600"
//           }`}
//         >
//           DESCRIPTION
//         </button>
//         <button
//           onClick={() => setActiveTab("additional")}
//           className={`pb-2 font-semibold ${
//             activeTab === "additional"
//               ? "border-b-2 border-teal-600 text-teal-600"
//               : "text-gray-600"
//           }`}
//         >
//           ADDITIONAL INFO
//         </button>
//         <button
//           onClick={() => setActiveTab("reviews")}
//           className={`pb-2 font-semibold ${
//             activeTab === "reviews"
//               ? "border-b-2 border-teal-600 text-teal-600"
//               : "text-gray-600"
//           }`}
//         >
//           REVIEWS (3)
//         </button>
//       </div>

//       {/* Tabs Content */}
//       <div className="mt-6">
//         {activeTab === "description" && (
//           <p className="dark:text-gray-300">
//             This is a high-quality product made from premium materials. It’s designed for comfort and style.
//           </p>
//         )}

//         {activeTab === "additional" && (
//           <table className="w-full text-left border mt-4 dark:text-gray-300">
//             <tbody>
//               <tr className="border-t ">
//                 <th className="p-2 font-semibold w-1/3 ">Weight</th>
//                 <td className="p-2">1 kg</td>
//               </tr>
//               <tr className="border-t">
//                 <th className="p-2 font-semibold">Dimensions</th>
//                 <td className="p-2">10 × 10 × 10 cm</td>
//               </tr>
//               <tr className="border-t border-b">
//                 <th className="p-2 font-semibold">Color</th>
//                 <td className="p-2">Black, White</td>
//               </tr>
//             </tbody>
//           </table>
//         )}

//         {activeTab === "reviews" && (
//       <div className="space-y-6 text-gray-700">

//         {/* Individual Review */}
//         {[
//           {
//             name: "Jacky Chan",
//             date: "December 4, 2020 at 3:12 pm",
//             comment: "Thank you very fast shipping from Poland only 3days.",
//             rating: 5,
//           },
//           {
//             name: "Ana Rosie",
//             date: "December 4, 2020 at 3:12 pm",
//             comment: "Great low price and works well.",
//             rating: 4,
//           },
//           {
//             name: "Steven Kenny",
//             date: "December 4, 2020 at 3:12 pm",
//             comment: "Authentic and Beautiful. Love these way more than expected. They are Great earphones.",
//             rating: 5,
//           },
//         ].map((review, i) => (
//           <div key={i} className="border-b pb-4">
//             <div className="flex items-start gap-4">
//               <img
//                 src="https://www.w3schools.com/howto/img_avatar.png" // Replace with actual avatar or use placeholder
//                 alt={review.name}
//                 className="w-10 h-10 rounded-full border"
//               />
//               <div>
//                 {/* Stars */}
//                 <div className="flex text-yellow-500 mb-1">
//                   {Array.from({ length: review.rating }).map((_, i) => (
//                     <span key={i}>★</span>
//                   ))}
//                   {Array.from({ length: 5 - review.rating }).map((_, i) => (
//                     <span key={i} className="dark:text-gray-300">★</span>
//                   ))}
//                 </div>

//                 <p className="text-sm dark:text-gray-300">{review.comment}</p>
//                 <div className="text-xs font-bold dark:text-gray-200 mt-1">
//                   {review.name} · {review.date} · <a href="#" className="text-brandBlue dark:text-brandWhite">Reply</a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//     {/* Add a Review */}
//     <div className="mt-6">
//       <h3 className="font-semibold mb-2 text-gray-400">Add a review</h3>
//       <form className="space-y-3">
//         <textarea
//           rows="4"
//           className="w-full border rounded p-2 dark:bg-black"
//           placeholder="Write Comment"
//         ></textarea>
//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full border rounded p-2 dark:bg-black"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border rounded p-2 dark:bg-black"
//         />
//         <input
//           type="text"
//           placeholder="Website"
//           className="w-full border rounded p-2 dark:bg-black"
//         />
//         <button
//           type="submit"
//           className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
//         >
//           Submit Review
//         </button>
//       </form>
//     </div>
//   </div>
// )}
//       </div>
//     </div>

//     {/* Related Products section */}
    
//     <div className="py-10 px-4 md:px-10">
//       <h2 className="text-2xl font-semibold text-center mb-8">Related Product</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//       {Relateditems.map((item)=><ProductLand key={item.id} product={item}/>)}
//       </div>
//     </div>
//     </div>
//   );
// };



// export default ProductOverView
