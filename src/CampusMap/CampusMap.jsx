
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./CampusMap.css";

const VIRTUAL_TOUR =
  "https://www.krmangalam.edu.in/campus-life/virtual-tour";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const CAN_EDIT_DESTINATIONS =
  import.meta.env.VITE_CAN_EDIT_DESTINATIONS === "true";

// Sirf initial map view ke liye approximate center.
// Ye kisi building ka verified coordinate nahi hai.
const CAMPUS_CENTER = [28.272846, 77.068499];

// Campus locations
const CAMPUS_PLACES = [
  { id: "entry", name: "Entry Gate", category: "Entry & Security", description: "Main campus entry." },
  { id: "exit", name: "Exit Gate", category: "Entry & Security", description: "Campus exit." },
  { id: "students-parking", name: "Students Parking", category: "Parking", description: "Student vehicle parking." },
  { id: "faculty-parking", name: "Faculty Parking", category: "Parking", description: "Faculty vehicle parking." },
  { id: "security", name: "Security Office", category: "Entry & Security", description: "Security office near campus entrance." },
  { id: "atm", name: "ATM", category: "Facilities", description: "ATM facility." },
  { id: "a-block", name: "A-Block", category: "Academic Blocks", description: "Ground-floor directory available." },
  { id: "b-block", name: "B-Block", category: "Academic Blocks", description: "Basement directory available." },
  { id: "c-block", name: "C-Block", category: "Academic Blocks", description: "Basement directory available." },
  { id: "cafeteria", name: "Cafeteria", category: "Food & Refreshments", description: "Cafeteria area." },
  { id: "football", name: "Football Ground", category: "Sports", description: "Outdoor football ground." },
  { id: "basketball", name: "Basketball Ground", category: "Sports", description: "Basketball court." },
  { id: "tennis", name: "Lawn Tennis Court", category: "Sports", description: "Lawn tennis court." },
  { id: "volleyball", name: "Volleyball Ground", category: "Sports", description: "Volleyball ground." },
  { id: "hostel", name: "Hostel Block", category: "Hostel", description: "Hostel area." },
  { id: "proposed-hostel", name: "Proposed Hostel Block", category: "Proposed", description: "Proposed facility; verify current status." },
  { id: "mechanic", name: "Mechanic Workshop", category: "Academic & Labs", description: "Mechanic workshop." },
  { id: "animal-house", name: "Animal House", category: "Academic & Labs", description: "Animal house facility." },
  { id: "biogas", name: "Biogas Plant", category: "Campus Facilities", description: "Biogas plant." },
  { id: "green-house", name: "Green House", category: "Campus Facilities", description: "Green house." },
  { id: "compost", name: "Compost Pit", category: "Campus Facilities", description: "Compost pit." },
  { id: "herbal-garden", name: "Herbal Garden", category: "Campus Facilities", description: "Herbal garden." },
  { id: "electrical", name: "Electrical Room", category: "Campus Facilities", description: "Restricted access." },
  { id: "agriculture", name: "Agriculture", category: "Campus Facilities", description: "Agriculture area." },
  { id: "cricket", name: "Cricket Ground", category: "Sports", description: "Cricket ground." },
  { id: "proposed-d", name: "Proposed D-Block", category: "Proposed", description: "Confirm current operational status." },
  { id: "stp", name: "STP Plant", category: "Campus Facilities", description: "Restricted access." },
  { id: "proposed-housing", name: "Proposed Housing Block", category: "Proposed", description: "Proposed housing facility." },
  { id: "nescafe", name: "Nescafe", category: "Food & Refreshments", description: "Nescafe outlet." }
];

// Floor directory 
const FLOOR_PLANS = {
  "A-Block": {
    floor: "Ground Floor",
    exits: [
      "The supplied plan shows exits at both ends of the corridor.",
      "The plan also shows a central stairway/exit route."
    ],
    groups: [
      {
        title: "Left Wing",
        rooms: [
          "A-001 Faculty Hall 1",
          "A-002 Physio-therapy OPD",
          "A-003 Server Room",
          "A-004 Admin & Transport Office",
          "A-006 Faculty Hall 2",
          "A-008 Registrar / Records Office"
        ]
      },
      {
        title: "Right Wing",
        rooms: [
          "A-009 Computer Laboratory I",
          "A-010 Administration Department",
          "A-011 Computer Laboratory III",
          "A-012 Computer Laboratory II",
          "A-014 Computer Laboratory IV",
          "A-016 Bosch Centre"
        ]
      },
      {
        title: "Other Facilities",
        rooms: ["Male Toilet", "Female Toilet"]
      }
    ]
  },

  "B-Block": {
    floor: "Basement",
    exits: [
      "The supplied plan shows a central stairway.",
      "The plan marks exit directions along both corridor ends.",
      "Follow the actual green exit arrows and building signage."
    ],
    groups: [
      {
        title: "Left Wing",
        rooms: [
          "B-413 Chemical Store",
          "B-511 Class Room",
          "B-509 Fluid Mechanics Lab",
          "B-507 Concrete Technology Lab",
          "B-555 Soil Mechanics Lab",
          "B-503 Drone Lab"
        ]
      },
      {
        title: "Right Wing",
        rooms: [
          "B-504 Electromechanical Energy Conversion Lab",
          "B-510 Physics Lab I",
          "B-512 Chemistry Lab I",
          "B-508 Machine Shop",
          "B-517 Heat Transformer Lab",
          "B-??? Other Workshop Area"
        ]
      }
    ]
  },

  "C-Block": {
    floor: "Basement",
    exits: [
      "The supplied plan shows a central stairway and exit arrows.",
      "Follow the actual green evacuation signs."
    ],
    groups: [
      {
        title: "Left Wing",
        rooms: [
          "Faculty & Staff",
          "Arts of Culinary Lab 3",
          "Arts of Culinary Lab 2",
          "F & B Training Lab",
          "Kitchen",
          "Cafeteria / Kitchen"
        ]
      },
      {
        title: "Right Wing",
        rooms: [
          "Billiard Club",
          "Table Tennis Club",
          "Carrom Club",
          "Football",
          "Chess Club",
          "Music Studio",
          "Dance Studio",
          "Store"
        ]
      }
    ]
  },

  "D-Block": {
    floor: "Hand-drawn layout",
    exits: [
      "Your supplied sketch marks an entry and staircase area.",
      "The sketch does not establish a verified emergency evacuation route."
    ],
    groups: [
      {
        title: "Left Side",
        rooms: [
          "Lift",
          "Dean Room",
          "Room D001",
          "Room D002"
        ]
      },
      {
        title: "Central Area",
        rooms: ["Sitting Area"]
      },
      {
        title: "Right Side",
        rooms: [
          "Room D004",
          "Room D005",
          "Room D006",
          "Canteen",
          "Stairs"
        ]
      }
    ]
  }
};

const CATEGORIES = [
  "All",
  "Academic Blocks",
  "Entry & Security",
  "Parking",
  "Food & Refreshments",
  "Sports",
  "Facilities",
  "Academic & Labs",
  "Campus Facilities",
  "Hostel",
  "Proposed"
];

// GPS marker
const currentIcon = new L.DivIcon({
  className: "sahayak-current-icon",
  html: '<div class="sahayak-current-dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Destination marker
const destinationIcon = new L.DivIcon({
  className: "sahayak-destination-icon",
  html: '<div class="sahayak-pin">📍</div>',
  iconSize: [32, 38],
  iconAnchor: [16, 36]
});

// Automatically zoom map to route
function FitMap({ current, destination, route }) {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 1) {
      map.fitBounds(route, { padding: [40, 40] });
    } else if (current && destination) {
      map.fitBounds([current, destination], { padding: [40, 40] });
    } else if (current) {
      map.setView(current, 18);
    } else if (destination) {
      map.setView(destination, 18);
    }
  }, [current, destination, route, map]);

  return null;
}

export default function CampusMap() {
  const [activeTab, setActiveTab] = useState("Campus");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("A-Block");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [currentLocation, setCurrentLocation] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  const [route, setRoute] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const [loadingGPS, setLoadingGPS] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  // Load saved destination coordinates
  const [places, setPlaces] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("sahayak-campus-coordinates") || "{}"
      );

      return CAMPUS_PLACES.map(place => ({
        ...place,
        ...(saved[place.id] || {})
      }));
    } catch {
      return CAMPUS_PLACES;
    }
  });

  const selectedPlace = places.find(
    place => place.id === selectedPlaceId
  ) || null;

  const currentFloor = FLOOR_PLANS[selectedBuilding];

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch =
        `${place.name} ${place.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || place.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [places, search, category]);

  // Select a place from directory
  function choosePlace(place) {
    setSelectedPlaceId(place.id);
    setActiveTab("Directions");
    setRoute([]);
    setRouteInfo(null);
    setError("");
  }

  // Get student's current GPS
  function getMyLocation() {
    setError("");
    setLoadingGPS(true);

    if (!navigator.geolocation) {
      setError("Aapke browser mein GPS support nahi hai.");
      setLoadingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords = [
          position.coords.latitude,
          position.coords.longitude
        ];

        setCurrentLocation(coords);
        setGpsAccuracy(position.coords.accuracy);
        setLoadingGPS(false);
      },
      err => {
        const messages = {
          1: "Location permission allow karein.",
          2: "Aapki location abhi nahi mil pa rahi.",
          3: "GPS request timeout ho gayi."
        };

        setError(messages[err.code] || "GPS location error.");
        setLoadingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  // Admin saves GPS for a selected destination
  function saveSelectedPlaceCoordinate() {
    if (!selectedPlace || !currentLocation) {
      setError("Pehle destination select karein aur GPS location lein.");
      return;
    }

    const updatedPlaces = places.map(place =>
      place.id === selectedPlaceId
        ? {
            ...place,
            lat: currentLocation[0],
            lng: currentLocation[1]
          }
        : place
    );

    setPlaces(updatedPlaces);

    const saved = Object.fromEntries(
      updatedPlaces
        .filter(place =>
          Number.isFinite(place.lat) &&
          Number.isFinite(place.lng)
        )
        .map(place => [
          place.id,
          { lat: place.lat, lng: place.lng }
        ])
    );

    localStorage.setItem(
      "sahayak-campus-coordinates",
      JSON.stringify(saved)
    );

    setError("");
    alert(`${selectedPlace.name} ka GPS coordinate save ho gaya.`);
  }

  // Find walking route
  async function findWalkingRoute() {
    setError("");
    setRoute([]);
    setRouteInfo(null);

    if (!currentLocation) {
      setError("Pehle Use My Current Location button dabayein.");
      return;
    }

    if (!selectedPlace) {
      setError("Pehle destination select karein.");
      return;
    }

    if (
      !Number.isFinite(selectedPlace.lat) ||
      !Number.isFinite(selectedPlace.lng)
    ) {
      setError(
        "Is destination ka GPS coordinate abhi configure nahi hai. Admin se coordinate verify karwayein."
      );
      return;
    }

    if (!ORS_API_KEY) {
      setError(
        "OpenRouteService API key configure nahi hui hai."
      );
      return;
    }

    setLoadingRoute(true);

    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
        {
          method: "POST",
          headers: {
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            coordinates: [
              [currentLocation[1], currentLocation[0]],
              [selectedPlace.lng, selectedPlace.lat]
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          data.message ||
          "Walking route calculate nahi ho paayi."
        );
      }

      const feature = data.features?.[0];

      if (!feature?.geometry?.coordinates?.length) {
        throw new Error("Walking path nahi mila.");
      }

      // API coordinates [longitude, latitude] deta hai
      // Leaflet coordinates [latitude, longitude] use karta hai
      const routePoints = feature.geometry.coordinates.map(
        point => [point[1], point[0]]
      );

      setRoute(routePoints);

      const summary = feature.properties?.summary;

      if (summary) {
        setRouteInfo({
          distance: (summary.distance / 1000).toFixed(2),
          duration: Math.ceil(summary.duration / 60)
        });
      }

    } catch (err) {
      setError(
        err.message ||
        "Route error. Internet aur API key check karein."
      );
    } finally {
      setLoadingRoute(false);
    }
  }

  return (
    <main className="cm-page">

      {/* HEADER */}
      <header className="cm-heading">
        <div>
          <span className="cm-eyebrow">
            SAHAYAK • STUDENT SERVICES
          </span>

          <h1>Campus Navigation</h1>

          <p>
            Find campus buildings, rooms and walking directions.
          </p>
        </div>

        <a
          className="cm-tour-button"
          href={VIRTUAL_TOUR}
          target="_blank"
          rel="noreferrer"
        >
          360° Virtual Tour ↗
        </a>
      </header>

      {/* TABS */}
      <nav className="cm-tabs">
        {["Campus", "Buildings", "Directions"].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Campus"
              ? "🗺️ Campus Map"
              : tab === "Buildings"
              ? "🏢 Building Directory"
              : "🧭 GPS Directions"}
          </button>
        ))}
      </nav>

      {/* CAMPUS DIRECTORY */}
      {activeTab === "Campus" && (
        <section className="cm-section">

          <div className="cm-search-row">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campus places..."
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <p className="cm-muted">
            Campus directory based on supplied campus information.
            This list is not a surveyed map and is not to scale.
          </p>

          <div className="cm-place-grid">
            {filteredPlaces.map(place => (
              <article className="cm-place-card" key={place.id}>
                <span className="cm-category">
                  {place.category}
                </span>

                <h3>{place.name}</h3>
                <p>{place.description}</p>

                {place.category === "Proposed" && (
                  <small className="cm-warning-text">
                    Proposed — confirm current status.
                  </small>
                )}

                <button
                  className="cm-small-button"
                  onClick={() => choosePlace(place)}
                >
                  Get Directions →
                </button>

                {["A-Block", "B-Block", "C-Block", "D-Block"].includes(place.name) && (
                  <button
                    className="cm-text-button"
                    onClick={() => {
                      setSelectedBuilding(place.name);
                      setSelectedRoom("");
                      setActiveTab("Buildings");
                    }}
                  >
                    View Floor Directory
                  </button>
                )}
              </article>
            ))}

            {filteredPlaces.length === 0 && (
              <p>No campus locations found.</p>
            )}
          </div>
        </section>
      )}

      {/* BUILDING DIRECTORY */}
      {activeTab === "Buildings" && (
        <section className="cm-section">

          <h2>Building & Floor Directory</h2>

          <p className="cm-muted">
            Select a building to explore its photographed floor plan.
          </p>

          <div className="cm-building-select">
            {Object.keys(FLOOR_PLANS).map(building => (
              <button
                key={building}
                className={
                  selectedBuilding === building ? "active" : ""
                }
                onClick={() => {
                  setSelectedBuilding(building);
                  setSelectedRoom("");
                  setSearch("");
                }}
              >
                {building}
              </button>
            ))}
          </div>

          <div className="cm-floor-heading">
            <span className="cm-category">
              SELECTED BUILDING
            </span>

            <h2>{selectedBuilding}</h2>
            <p>{currentFloor.floor}</p>
          </div>

          <input
            className="cm-room-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search room number or name..."
          />

          <div className="cm-room-grid">
            {currentFloor.groups.map((group, index) => {
              const visibleRooms = group.rooms.filter(room =>
                room.toLowerCase().includes(search.toLowerCase())
              );

              return (
                <article
                  className="cm-room-group"
                  key={group.title}
                >
                  <h3>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {group.title}
                  </h3>

                  {visibleRooms.map(room => (
                    <button
                      key={room}
                      className={
                        selectedRoom === room
                          ? "cm-room chosen"
                          : "cm-room"
                      }
                      onClick={() => setSelectedRoom(room)}
                    >
                      <span>📍</span>
                      {room}
                      <b>›</b>
                    </button>
                  ))}

                  {visibleRooms.length === 0 && (
                    <p className="cm-muted">
                      No matching rooms.
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {selectedRoom && (
            <div className="cm-room-detail">
              <span className="cm-category">
                SELECTED ROOM
              </span>

              <h3>{selectedRoom}</h3>

              <p>
                {selectedBuilding} · {currentFloor.floor}
              </p>

              <p className="cm-muted">
                Room listing is based on the supplied floor-plan
                photograph. Confirm room signage on-site.
              </p>

              <button
                className="cm-primary-button"
                onClick={() => {
                  const buildingPlace = places.find(
                    p => p.name === selectedBuilding
                  );
                   setSelectedPlaceId(buildingPlace?.id || "");
                     setRoute([]);
                      setRouteInfo(null);
                     setError("");
                       setActiveTab("Directions");
                }}
              >
                Open Building GPS Directions
              </button>
            </div>
          )}

          <aside className="cm-exit-information">
            <h3>Emergency Exit Information</h3>

            <ul>
              {currentFloor.exits.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>

            <strong>
              Emergency mein actual posted evacuation arrows
              aur campus security ki instructions follow karein.
              Ye directory emergency guidance ka substitute nahi hai.
            </strong>
          </aside>
        </section>
      )}

      {/* GPS DIRECTIONS */}
      {activeTab === "Directions" && (
        <section className="cm-directions-layout">

          <div className="cm-panel">
            <h2>Find a Campus Destination</h2>

            <label className="cm-label">
              Select Destination
            </label>

          <select
            className="cm-input"
            value={selectedPlaceId}
            onChange={e => {
             setSelectedPlaceId(e.target.value);
              setRoute([]);
             setRouteInfo(null);
             setError("");
     }}
>
              <option value="">Choose destination</option>

              {places.map(place => (
                <option key={place.id} value={place.id}>
                  {place.name}
                  {Number.isFinite(place.lat)
                    ? " ✓ GPS saved"
                    : " • GPS pending"}
                </option>
              ))}
            </select>

            {selectedPlace && (
              <div className="cm-destination-info">
                <strong>{selectedPlace.name}</strong>
                <span>{selectedPlace.category}</span>

                <small>
                  {Number.isFinite(selectedPlace.lat)
                    ? "GPS coordinate saved"
                    : "GPS coordinate not configured"}
                </small>
              </div>
            )}

            <button
              className="cm-button cm-location-button"
              onClick={getMyLocation}
              disabled={loadingGPS}
            >
              {loadingGPS
                ? "Getting GPS..."
                : "◎ Use My Current Location"}
            </button>

            {currentLocation && (
              <div className="cm-gps-status">
                ● Current location detected

                <small>
                  GPS Accuracy: approximately{" "}
                  {Math.round(gpsAccuracy || 0)} metres
                </small>
              </div>
            )}

            <button
              className="cm-button cm-route-button"
              onClick={findWalkingRoute}
              disabled={loadingRoute}
            >
              {loadingRoute
                ? "Finding Walking Route..."
                : "➤ Find Walking Route"}
            </button>

            {routeInfo && (
              <div className="cm-route-result">
                <div>
                  <strong>{routeInfo.distance} km</strong>
                  <small>Walking Distance</small>
                </div>

                <div>
                  <strong>{routeInfo.duration} min</strong>
                  <small>Estimated Time</small>
                </div>
              </div>
            )}

            {error && (
              <div className="cm-error">
                {error}
              </div>
            )}

            {CAN_EDIT_DESTINATIONS && (
              <div className="cm-admin-box">
                <h3>Admin: Save Destination GPS</h3>

                <p>
                  Selected destination par physically khade
                  hokar GPS location lein, phir save karein.
                </p>

                <button
                  className="cm-button cm-save-button"
                  onClick={saveSelectedPlaceCoordinate}
                  disabled={!currentLocation || !selectedPlace}
                >
                  Save GPS for Selected Destination
                </button>

                <small>
                  Coordinates abhi isi browser mein save hote hain.
                  Sab students ke liye backend/database chahiye.
                </small>
              </div>
            )}

            <div className="cm-legend">
              <span>
                <i className="cm-legend-blue"></i>
                Walking Route
              </span>

              <span>
                <i className="cm-legend-green"></i>
                Your Location
              </span>

              <span>
                <i className="cm-legend-red"></i>
                Destination
              </span>
            </div>
          </div>

          {/* LIVE MAP */}
          <div className="cm-map-panel">
            <div className="cm-map-top">
              <strong>Campus Map</strong>
              <span>Walking Mode</span>
            </div>

            <MapContainer
              center={CAMPUS_CENTER}
              zoom={16}
              scrollWheelZoom={true}
              className="cm-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={currentIcon}
                >
                  <Popup>Your Current Location</Popup>
                </Marker>
              )}

              {selectedPlace &&
                Number.isFinite(selectedPlace.lat) &&
                Number.isFinite(selectedPlace.lng) && (
                  <Marker
                    position={[
                      selectedPlace.lat,
                      selectedPlace.lng
                    ]}
                    icon={destinationIcon}
                  >
                    <Popup>{selectedPlace.name}</Popup>
                  </Marker>
                )}

              {route.length > 0 && (
                <Polyline
                  positions={route}
                  pathOptions={{
                    color: "#1677ff",
                    weight: 6,
                    opacity: 0.9
                  }}
                />
              )}

              <FitMap
                current={currentLocation}
                destination={
                  selectedPlace &&
                  Number.isFinite(selectedPlace.lat) &&
                  Number.isFinite(selectedPlace.lng)
                    ? [selectedPlace.lat, selectedPlace.lng]
                    : null
                }
                route={route}
              />
            </MapContainer>

            <p className="cm-map-note">
              Blue route tabhi dikhega jab routing service
              walking path return kare. Private campus pathways
              map mein missing ho sakte hain.
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="cm-footer">
        <span>SAHAYAK Campus Assistance</span>

        <a
          href={VIRTUAL_TOUR}
          target="_blank"
          rel="noreferrer"
        >
          Explore Official KRMU 360° Virtual Tour ↗
        </a>
      </footer>
    </main>
  );
}
