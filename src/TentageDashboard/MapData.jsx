import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOutletContext } from "react-router";
import good from "./../assets/Dashboard/tentGood.png";
import tentUnderMaintenance from "./../assets/Dashboard/tentUnderMaintenance.png";
import TentRequiresCleaning from "./../assets/Dashboard/TentReqiresCleaning.png";

// Define icons for different statuses
const icons = {
  good: new L.Icon({
    iconUrl: good, // Update with actual path or use URL
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
  requiresAttention: new L.Icon({
    iconUrl: TentRequiresCleaning, // Update with actual path or use URL
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
  underMaintenance: new L.Icon({
    iconUrl: tentUnderMaintenance, // Update with actual path or use URL
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
};

// Tent locations and details
const tents = [
  {
    id: "T1010",
    lat: 25.4358,
    lng: 81.8463,
    lastClean: "10:37 AM",
    nextSchedule: "12:37 AM",
    team: "Team Alpha",
    avgResponseTime: "15 min",
    status: "requiresAttention",
  },
  {
    id: "T1024",
    lat: 25.4478,
    lng: 81.8721,
    lastClean: "09:20 AM",
    nextSchedule: "02:10 PM",
    team: "Team Beta",
    avgResponseTime: "10 min",
    status: "good",
  },
  {
    id: "T1029",
    lat: 25.4204,
    lng: 81.8541,
    lastClean: "08:15 AM",
    nextSchedule: "01:00 PM",
    team: "Team Alpha",
    avgResponseTime: "20 min",
    status: "underMaintenance",
  },
  {
    id: "T1032",
    lat: 25.4405,
    lng: 81.8501,
    lastClean: "11:30 AM",
    nextSchedule: "03:30 PM",
    team: "Team Beta",
    avgResponseTime: "12 min",
    status: "requiresAttention",
  },
  {
    id: "T1035",
    lat: 25.4298,
    lng: 81.8375,
    lastClean: "07:45 AM",
    nextSchedule: "12:45 PM",
    team: "Team Gamma",
    avgResponseTime: "18 min",
    status: "good",
  },
  {
    id: "T1041",
    lat: 25.4372,
    lng: 81.8264,
    lastClean: "09:00 AM",
    nextSchedule: "02:00 PM",
    team: "Team Alpha",
    avgResponseTime: "10 min",
    status: "requiresAttention",
  },
  {
    id: "T1045",
    lat: 25.4256,
    lng: 81.858,
    lastClean: "06:00 AM",
    nextSchedule: "10:30 AM",
    team: "Team Beta",
    avgResponseTime: "14 min",
    status: "underMaintenance",
  },
  {
    id: "T1050",
    lat: 25.4482,
    lng: 81.8352,
    lastClean: "12:00 PM",
    nextSchedule: "04:00 PM",
    team: "Team Gamma",
    avgResponseTime: "16 min",
    status: "good",
  },
  {
    id: "T1053",
    lat: 25.4345,
    lng: 81.8456,
    lastClean: "01:15 PM",
    nextSchedule: "05:00 PM",
    team: "Team Alpha",
    avgResponseTime: "15 min",
    status: "requiresAttention",
  },
  {
    id: "T1060",
    lat: 25.4435,
    lng: 81.8525,
    lastClean: "09:40 AM",
    nextSchedule: "03:00 PM",
    team: "Team Beta",
    avgResponseTime: "12 min",
    status: "good",
  },
  {
    id: "T1063",
    lat: 25.4311,
    lng: 81.8402,
    lastClean: "11:00 AM",
    nextSchedule: "04:00 PM",
    team: "Team Gamma",
    avgResponseTime: "20 min",
    status: "underMaintenance",
  },
  {
    id: "T1070",
    lat: 25.4461,
    lng: 81.8498,
    lastClean: "07:30 AM",
    nextSchedule: "11:30 AM",
    team: "Team Alpha",
    avgResponseTime: "13 min",
    status: "good",
  },
  {
    id: "T1075",
    lat: 25.4287,
    lng: 81.8421,
    lastClean: "05:00 AM",
    nextSchedule: "09:00 AM",
    team: "Team Beta",
    avgResponseTime: "17 min",
    status: "requiresAttention",
  },
  {
    id: "T1080",
    lat: 25.4392,
    lng: 81.8248,
    lastClean: "08:20 AM",
    nextSchedule: "01:20 PM",
    team: "Team Gamma",
    avgResponseTime: "14 min",
    status: "good",
  },
  {
    id: "T1085",
    lat: 25.443,
    lng: 81.8315,
    lastClean: "02:30 PM",
    nextSchedule: "06:30 PM",
    team: "Team Alpha",
    avgResponseTime: "12 min",
    status: "underMaintenance",
  },
];

const MapData = () => {
    const [dict, lang] = useOutletContext();

  return (
    <div>
      <div className="flex justify-between flex-wrap">
        <div className="text-xl font-semibold p-2">{dict.location_of_tents[lang]}</div>
        <div className="flex text-sm gap-3 items-center justify-end p-1">
          <div className="flex gap-1 justify-center items-center">
            <div className="h-full flex items-center">{dict.require_attention[lang]}</div>
            <img className="h-5 w-5" src={TentRequiresCleaning} alt="" />
          </div>
          <div className="flex gap-1 justify-center items-center">
            <span className="h-full flex items-center">{dict.good[lang]}</span>
            <img className="h-5 w-5" src={good} alt="" />
          </div>
          <div className="flex gap-1 justify-center items-center">
            <span className="h-full flex items-center">{dict.under_maintenance[lang]}</span>
            <img className="h-5 w-5" src={tentUnderMaintenance} alt="" />
          </div>
        </div>
      </div>
      <MapContainer
        center={[25.4358, 81.8463]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {tents.map((tent) => (
          <Marker
            key={tent.id}
            position={[tent.lat, tent.lng]}
            icon={icons[tent.status]} // Set icon based on tent status
          >
            <Popup>
              <div>
                <strong>{tent.id}</strong>
                <div>Last Clean: {tent.lastClean}</div>
                <div>Next Schedule: {tent.nextSchedule}</div>
                <div>Team: {tent.team}</div>
                <div>Average Response Time: {tent.avgResponseTime}</div>
                <span className="mr-2 rounded-md">Status:</span>
                <button
                  style={{
                    padding: "2px 7px",
                    backgroundColor:
                      tent.status === "good"
                        ? "#50C878"
                        : tent.status === "requiresAttention"
                        ? "#FFAC1C"
                        : "red",
                    color: "white",
                  }}
                >
                  {tent.status === "good"
                    ? "Good"
                    : tent.status === "requiresAttention"
                    ? "Requires Attention"
                    : "Under Maintenance"}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapData;
