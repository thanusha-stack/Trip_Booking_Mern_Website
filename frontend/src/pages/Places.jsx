import { useState } from "react";
import PlaceList from "../components/PlaceList";
import places from "../dataset/placeList";

function Places() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // get unique categories
  const categories = ["All", ...new Set(places.map(p => p.category))];

  // filter logic
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h2 className="text-center mb-4">Mysore Tourist Places</h2>

      {/* 🔍 Search + Category */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🏞️ Places */}
      <div className="row">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <div className="col-md-4 mb-4" key={place.id}>
              <PlaceList {...place} />
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No places found</p>
        )}
      </div>
    </div>
  );
}

export default Places;
