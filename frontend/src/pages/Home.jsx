import React from 'react'
import Welcome from '../components/Welcome';
import places from "../dataset/placeList"
import PlaceList from '../components/PlaceList';
import Testimonials from '../components/Testimonials';
import Carosel from '../components/Carosel';
import Footer from '../components/Footer';


function Home() {
  return (
    <div>
      <Testimonials />
      <div className="container mt-5">
      <h2 className="text-center mb-4">Top Places in Mysore</h2>
      <div className="row">
        {places.slice(0, 3).map(place => (
          <div className="col-md-4 mb-4" key={place.id}>
            <PlaceList {...place} />
          </div>
        ))}
      </div>
    </div>
    <Carosel />
    <Footer />
    </div>
  )
}

export default Home;