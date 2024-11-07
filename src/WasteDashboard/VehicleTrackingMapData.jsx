import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { message } from "antd";
import "leaflet/dist/leaflet.css"; 
import Tippers from "../assets/Dashboard/Tippers.png";

const vehicleIcon = new L.Icon({
  iconUrl: Tippers, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
});

const VehicleMap = () => {
  const [vehicleData, setVehicleData] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/vehicle-tracking?page=1&per_page=5&date_format=Today",
          {
            method: "GET",
            headers: headers,
          }
        );
        const result = await response.json();
        console.log("Fetched vehicle data:", result);

        if (result.success && result.data && result.data.listings) {
          const listings = result.data.listings.map((vehicle) => ({
            ...vehicle,
            lat: parseFloat(vehicle.lat),
            lng: parseFloat(vehicle.lng),
          }));
          setVehicleData(listings);
        } else {
          message.error("Failed to load vehicle details.");
        }
      } catch (error) {
        message.error("Error fetching vehicle details.");
        console.error("Fetch error:", error);
      }
    };

    fetchVehicleData();
    const intervalId = setInterval(fetchVehicleData, 5000); // Refresh data every 5 seconds

    return () => clearInterval(intervalId);
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
              <p>Speed: {vehicle.speed} km/h</p>
              <p>Direction: {vehicle.angle}°</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default VehicleMap;
