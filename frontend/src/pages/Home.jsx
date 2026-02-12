import React from 'react'
import Welcome from '../components/Welcome';

import Testimonials from '../components/Testimonials';
import Carosel from '../components/Carosel';
import Footer from '../components/Footer';


function Home() {
  return (
    <div>
      <Welcome />
      <Testimonials />
      <Carosel />
      <Footer />
    </div>
  )
}

export default Home;