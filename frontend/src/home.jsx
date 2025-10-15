import React from 'react'
import Category from './components/category.jsx';
import Categoryslider from './components/categoryslider.jsx';
import Countdown from './components/countdown.jsx';
import Hero from './components/hero.jsx';
import Services from './components/services.jsx';
import Parallax from './components/parallax.jsx';
import Featured from './components/featured.jsx';
import Dblocks from './components/2blocks.jsx';
import Brandslider from './components/brandslider.jsx';
import Trending from './components/trending.jsx';
import TestimonialSlider from './components/testimonalslider.jsx';
function Home() {
  return (
    <div>
      <Hero/>
      <Category/>
      <Featured/>
      <Categoryslider/>
      <Dblocks/>
      <Services/>
      <Countdown/>
  
      {/* Popular */}
      <Trending/>
      <Brandslider/>
      <Parallax/>
      <TestimonialSlider/>
    </div>
  )
}

export default Home