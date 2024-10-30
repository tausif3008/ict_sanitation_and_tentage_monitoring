import React, { useEffect, useRef, useState } from "react";
import toilet from "../assets/MonitoringImages/Dashboard/requireCliningToilet.png";
import cleanedIcon from "../assets/MonitoringImages/Dashboard/ClinedToilets.png";
import UnderMaintenanceIcon from "../assets/MonitoringImages/Dashboard/UnderMaintenanceToilet.png";

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

const MapData = (props) => {
  return (
    <div className="rounded-md">
      <MapComponent {...props}></MapComponent>
    </div>
  );
};

export default MapData;

const defaultIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535137.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const toiletIconsMap = L.icon({
  iconUrl: cleanedIcon,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const toiletIconCleaningRequire = L.icon({
  iconUrl: toilet,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const underMaintenanceIcon = L.icon({
  iconUrl: UnderMaintenanceIcon,
  iconSize: [24, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Updated toilet data
const toiletLatLong = [
  {
    id: "TOI12459",
    name: "Toilet 1",
    lat: 25.4314,
    lng: 81.8785,
    type: "Portable Toilet",
    lastClean: "10:37 AM",
    nextSchedule: "12:37 PM",
    team: "Team Alpha",
    responseTime: "15 min",
    status: "Requires cleaning",
  },
  {
    id: "TOI12460",
    name: "Toilet 2",
    lat: 25.4268,
    lng: 81.8862,
    type: "Permanent Toilet",
    lastClean: "09:30 AM",
    nextSchedule: "11:30 AM",
    team: "Team Bravo",
    responseTime: "18 min",
    status: "Cleaned",
  },
  {
    id: "TOI12461",
    name: "Toilet 3",
    lat: 25.4268,
    lng: 81.8162,
    type: "Septic Tank Toilet",
    lastClean: "08:45 AM",
    nextSchedule: "10:45 AM",
    team: "Team Alpha",
    responseTime: "12 min",
    status: "Under Maintenance",
  },
  {
    id: "TOI12462",
    name: "Toilet 4",
    lat: 25.4314,
    lng: 81.8548,
    type: "Portable Toilet",
    lastClean: "10:00 AM",
    nextSchedule: "12:00 PM",
    team: "Team Charlie",
    responseTime: "16 min",
    status: "Cleaned",
  },
  {
    id: "TOI12463",
    name: "Toilet 5",
    lat: 25.4368,
    lng: 81.8729,
    type: "Permanent Toilet",
    lastClean: "07:45 AM",
    nextSchedule: "09:45 AM",
    team: "Team Delta",
    responseTime: "19 min",
    status: "Requires cleaning",
  },
  {
    id: "TOI12464",
    name: "Toilet 6",
    lat: 25.4268,
    lng: 81.8269,
    type: "Septic Tank Toilet",
    lastClean: "06:30 AM",
    nextSchedule: "08:30 AM",
    team: "Team Alpha",
    responseTime: "14 min",
    status: "Under Maintenance",
  },
  {
    id: "TOI12465",
    name: "Toilet 7",
    lat: 25.4468,
    lng: 81.8169,
    type: "Portable Toilet",
    lastClean: "11:00 AM",
    nextSchedule: "01:00 PM",
    team: "Team Bravo",
    responseTime: "13 min",
    status: "Requires cleaning",
  },
  {
    id: "TOI12466",
    name: "Toilet 8",
    lat: 25.4514,
    lng: 81.8645,
    type: "Permanent Toilet",
    lastClean: "09:15 AM",
    nextSchedule: "11:15 AM",
    team: "Team Delta",
    responseTime: "20 min",
    status: "Cleaned",
  },
  {
    id: "TOI12467",
    name: "Toilet 9",
    lat: 25.4212,
    lng: 81.8548,
    type: "Septic Tank Toilet",
    lastClean: "07:50 AM",
    nextSchedule: "09:50 AM",
    team: "Team Charlie",
    responseTime: "17 min",
    status: "Under Maintenance",
  },
  {
    id: "TOI12468",
    name: "Toilet 10",
    lat: 25.4618,
    lng: 81.8765,
    type: "Portable Toilet",
    lastClean: "06:45 AM",
    nextSchedule: "08:45 AM",
    team: "Team Alpha",
    responseTime: "12 min",
    status: "Requires cleaning",
  },
];


const MapComponent = ({ tentage = true }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    lat: 25.435,
    lng: 81.8807,
  });
  const [routeControl, setRouteControl] = useState(null);

  const handleMarkerClick = (lat, lng) => {
    if (!mapRef.current) {
      console.error("Map is not available yet.");
      return;
    }

    const map = mapRef.current;

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Requires cleaning":
        return {
          backgroundColor: "yellow",
          padding: "5px",
          borderRadius: "5px",
        };
      case "Cleaned":
        return {
          backgroundColor: "green",
          padding: "5px",
          borderRadius: "5px",
          color: "white",
        };
      case "Under Maintenance":
        return {
          backgroundColor: "red",
          padding: "5px",
          borderRadius: "5px",
          color: "white",
        };
      default:
        return {};
    }
  };

  return (
    <div>
      <div className="flex justify-between flex-wrap">
        <div className="text-xl font-semibold p-2">Locations Of Sanitation</div>
        <div className="flex text-sm gap-3 items-center justify-end p-1">
          <div className="flex gap-1 justify-center items-center">
            <div className="h-full flex items-center">Require Cleaning:</div>
            <img className="h-5 w-5" src={toilet} alt="" />
          </div>
          <div className="flex gap-1 justify-center items-center">
            <span className="h-full flex items-center">Cleaned:</span>
            <img className="h-5 w-5" src={cleanedIcon} alt="" />
          </div>
          <div className="flex gap-1 justify-center items-center">
            <span className="h-full flex items-center">Under Maintenance:</span>
            <img className="h-5 w-5" src={UnderMaintenanceIcon} alt="" />
          </div>
        </div>
      </div>
      <MapContainer
        center={[25.4358, 81.8463]}
        zoom={13}
        minZoom={10}
        maxZoom={18}
        style={{ height: "425px", width: "100%", zIndex: 1 }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {toiletLatLong.map((place, index) => (
          <Marker
            key={index + place}
            position={[place.lat, place.lng]}
            icon={
              place.status === "Requires cleaning"
                ? toiletIconCleaningRequire
                : place.status === "Under Maintenance"
                ? underMaintenanceIcon
                : toiletIconsMap
            }
            eventHandlers={{
              click: () => handleMarkerClick(place.lat, place.lng),
            }}
          >
            <Popup>
              <div>
                <strong>#{place.id}</strong>
                <br />
                <span>{place.type}</span>
                <br />
                <span>Last Clean: {place.lastClean}</span>
                <br />
                <span>Next Schedule: {place.nextSchedule}</span>
                <br />
                <span>Team: {place.team}</span>
                <br />
                <span>Average response time: {place.responseTime}</span>
                <br />
                <span className="flex mt-1"  style={getStatusStyle(place.status)}>{place.status}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
