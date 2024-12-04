import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import Tippers from "../assets/Dashboard/Tippers.png";
import WasteDashSelector from "./Slice/wasteDashSelector";
import { getWasteDashData } from "./Slice/wasteDashboardSlice";

const vehicleIcon = new L.Icon({
  iconUrl: Tippers,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const VehicleMap = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const { wasteDash_data } = WasteDashSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    if (wasteDash_data) {
      const myDashData = wasteDash_data?.data?.listings;
      const listings = myDashData?.map((vehicle) => ({
        ...vehicle,
        lat: parseFloat(vehicle?.lat),
        lng: parseFloat(vehicle?.lng),
      }));
      setVehicleData(listings);
    }
  }, [wasteDash_data]);

  useEffect(() => {
    dispatch(getWasteDashData()); // waste dash data
    const intervalId = setInterval(() => {
      dispatch(getWasteDashData()); // waste dash data
    }, [5000]);

    return () => {
      clearInterval(intervalId);
    };
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
      {vehicleData?.length > 0 ? (
        vehicleData?.map((vehicle) => (
          <Marker
            key={vehicle?.tracking_id}
            position={[vehicle?.lat, vehicle?.lng]}
            icon={vehicleIcon}
          >
            <Popup>
              <div>
                <h3>Vehicle ID: {vehicle?.tracking_id}</h3>
                <p>IMEI: {vehicle?.imei}</p>
                <p>
                  Last Updated: {new Date(vehicle?.dt_tracker).toLocaleString()}
                </p>
                <p>Speed: {vehicle?.speed} km/h</p>
                <p>Direction: {vehicle?.angle}°</p>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <p>No vehicles available.</p>
      )}
    </MapContainer>
  );
};

export default VehicleMap;
