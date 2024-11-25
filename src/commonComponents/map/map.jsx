import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Modal } from "antd";
import L from "leaflet";

const CoordinatesMap = ({
  coordinates,
  showtext = true,
  showLocation = true,
}) => {
  const [open, setOpen] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  // Extract latitude and longitude from coordinates
  const lat = coordinates?.[1];
  const long = coordinates?.[0];

  const handleOpen = () => setOpen(!open);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (mapRef && open) {
      mapRef.invalidateSize();
    }
  }, [mapRef, open]);

  if (!coordinates || isNaN(lat) || isNaN(long)) {
    return <div>Invalid coordinates</div>;
  }

  // Create a custom icon if desired
  const customIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Default marker icon URL, replace with your own image if needed
    iconSize: [25, 41], // Size of the marker
    iconAnchor: [12, 41], // Anchor point of the marker
    popupAnchor: [1, -34], // Position of the popup
  });

  return (
    <>
      {coordinates ? (
        <>
          <div
            className="hover:text-blue-500 cursor-pointer flex justify-evenly"
            onClick={handleOpen}
          >
            <div>
              {showtext && (
                <div className="text-blue-500 cursor-pointer"> View map</div>
              )}
              {showLocation && (
                <>
                  <div>{Number(lat)?.toFixed(3)}</div>
                  <div>{Number(long)?.toFixed(3)}</div>
                </>
              )}
            </div>
          </div>
          <Modal
            visible={open}
            onCancel={closeModal}
            title={"View Location"}
            footer={null}
          >
            <div className="">
              <MapContainer
                center={[lat, long]}
                zoom={13}
                className="h-[300px] w-full"
                ref={(r) => setMapRef(r)}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer // satelite view
                  url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={20}
                  subdomains={["mt1", "mt2", "mt3"]}
                /> */}
                <Marker position={[lat, long]} icon={customIcon}>
                  <Popup>
                    Latitude: {Number(lat)?.toFixed(3)}, Longitude:{" "}
                    {Number(long)?.toFixed(3)}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Modal>
        </>
      ) : (
        "-"
      )}
    </>
  );
};

export default CoordinatesMap;
