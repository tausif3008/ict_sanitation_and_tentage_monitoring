import { Anchor } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Built-in Leaflet icon for markers
const defaultIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535137.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const toiletIconsMap = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Nearby places
const places = [
  { id: 1, name: "Toilet 1", lat: 18.5145, lng: 73.8068 },
  { id: 2, name: "Toilet 2", lat: 18.515, lng: 73.807 },
  { id: 3, name: "Toilet 3", lat: 18.513, lng: 73.8055 },
  { id: 4, name: "Toilet 4", lat: 18.516, lng: 73.808 },
  // Add more places as needed
];

const UserLocationMarker = ({ setUserLocation }) => {
  const map = useMapEvents({
    locationfound: (e) => {
      setUserLocation(e.latlng);
      if (map) {
        map.setView(e.latlng, 16);
        L.marker(e.latlng, { icon: defaultIcon })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      }
    },
    locationerror: () => {
      alert("Could not access your location.");
    },
  });

  useEffect(() => {
    if (map) {
      map.locate({ setView: true, maxZoom: 5 });
    }
  }, [map]);

  return null;
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    lat: 18.5139569,
    lng: 73.8066049,
  });
  const [routeControl, setRouteControl] = useState(null);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      if (routeControl) {
        routeControl.setWaypoints([
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(userLocation.lat, userLocation.lng),
        ]);
      }
    }
  }, [userLocation, routeControl]);

  const handleMarkerClick = (lat, lng) => {
    if (!mapRef.current) {
      console.error("Map is not available yet.");
      return;
    }

    const map = mapRef.current;
    console.log("Creating route control with waypoints:", [
      L.latLng(userLocation.lat, userLocation.lng),
      L.latLng(lat, lng),
    ]);

    const newRouteControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(lat, lng),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
    });

    newRouteControl.addTo(map);
    setRouteControl(newRouteControl);
  };

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={10}
      style={{ height: "270px", width: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <UserLocationMarker setUserLocation={setUserLocation} />
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={defaultIcon}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
      {places.map((place) => (
        <Marker
          position={[place.lat, place.lng]}
          icon={toiletIconsMap}
          eventHandlers={{
            click: () => handleMarkerClick(place.lat, place.lng),
          }}
        >
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const RegisterFoundPerson = () => {
  return <div>{<MapComponent></MapComponent>}</div>;
};

export default RegisterFoundPerson;
