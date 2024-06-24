import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Modal } from "flowbite-react";
import {
  HiSun,
  HiMap,
  HiPhone
} from "react-icons/hi";

const mapContainerStyle = {
  height: "600px",
  width: "100%",
};

const center = {
  lat: -28.4793,
  lng: 24.6727,
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.toString() ?? "";
const FarmersMap = ({
  markers,
}: {
  markers: Array<{
    id: number;
    position: { lat: number; lng: number };
    label: string;
    address: string;
    phone: string;
    crops: string;
  }>;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalCrops, setModalCrops] = useState("");
  const [modalAddress, setModalAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [modalPhone, setModalPhone] = useState("");

  const [modalHeader, setModalHeader] = useState("");

  const handleMarkerClick = (marker: {
    crops: string;
    address: string;
    phone: string;
    id: number;
    position: { lat: number; lng: number };
    label: string;
  }) => {
    // Add your logic here for handling marker click
    setModalAddress(marker.address);
    setModalPhone(marker.phone);
    setModalHeader(marker.label);
    setModalCrops(marker.crops);
    setLat(marker.position.lat.toString());
    setLong(marker.position.lng.toString());
    setOpenModal(true);

    console.log("modalCrops:", marker.crops); 
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} onLoad={handleMapLoad}>
      {isMapLoaded && (
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={5}>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={marker.label.substring(0, 1)}
              title={marker.label}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
        </GoogleMap>
      )}

      <Modal show={openModal} onClose={handleModalClose}>
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <HiMap className="inline mr-3"/><a target="_blank" href={`https://www.google.com/maps/search/${lat},${long}`}>{modalAddress}</a>
              <br />
              <HiPhone className="inline mr-3"/><a target="_blank" href={`tel:${modalPhone}`}>{modalPhone}</a>
              <br />
              <HiSun className="inline mr-3"/>{modalCrops}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </LoadScript>
  );
};

export default FarmersMap;
