// VehicleMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom icon for the vehicle markers
const vehicleIcon = new L.Icon({
  iconUrl: "../assets/Dashboard/Tippers.png", // path to your custom vehicle icon
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

const VehicleMap = () => {
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      const response = await fetch(
        `https://kumbhtsmonitoring.in/php-api//vehicle-tracking?page=1&per_page=5`
      );
      const data = await response.json();
      if (data.success) {
        setVehicleData(data.data.listings);
      }
    };

    fetchVehicleData();
  }, []);

  return (
    <MapContainer
      center={[25.438727, 81.875347]}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {vehicleData.map((vehicle) => (
        <Marker
          key={vehicle.tracking_id}
          position={[vehicle.lat, vehicle.lng]}
          icon={vehicleIcon}
        >
          <Popup>
            <div>
              <h3>Vehicle ID: {vehicle.tracking_id}</h3>
              <p>IMEI: {vehicle.imei}</p>
              <p>
                Last Updated: {new Date(vehicle.dt_tracker).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default VehicleMap;
