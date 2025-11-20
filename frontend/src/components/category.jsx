import React from "react";
import Loader from "./shared/loader";
import { Link,useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

function Category() {
  const navigate = useNavigate();
  const [CatData, setCatData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const NavigateClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  React.useEffect(() => {
    // Replace this with your actual API URL
    fetch(`${BASE_URL}/category/`)
      .then(res => res.json())
      .then(data => {
        setCatData(data);
        setLoading(false);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  return (
    <div className='container'>
      <div className="max-w-9xl mx-auto px-4 py-8 ">
      <div className="grid grid-cols-3 gap-6">
        {CatData.map((item,index)=>
        item.icon_in_landing_page===true && (
          
          <div key={index} className="Caro-bg cursor-pointer rounded-lg shadow p-6 text-center cursor-pointer group" onClick={() => NavigateClick(item.slug)}>
          <div className="text-4xl mb-6 duration-300 dark:text-brandWhite group-hover:scale-150 transition-all ease-in-out duration-500">
            <i className={`fi fi-${item.icon_landing_page} m-auto`}></i>
          </div>
          <h2 className="text-lg font-semibold group-hover:tracking-widest transition-all duration-300 ease-in-out dark:text-brandWhite">{item.name}</h2>
        </div>
        ))
        }

        </div>
      </div>
    </div>
  )
}

export default Category