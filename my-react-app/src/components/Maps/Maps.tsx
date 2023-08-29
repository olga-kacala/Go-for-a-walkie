import {
  GoogleMap,
  Marker,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import classes from "./Maps.module.css";

export const Maps = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markers, setMarkers] = useState<
    { lat: number; lng: number; id: number }[]
  >([]);
  const markerIdCounter = useRef(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat, lng, id: markerIdCounter.current++ },
      ]);
    }
  };

  const handleMarkerClick = (markerID: number) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerID)
    );
  };

  return (
    <div className={classes.Map}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName={classes.mapContainer}
          center={
            userLocation || { lat: 50.65696776753784, lng: 17.9230121375674 }
          }
          zoom={10}
          onClick={handleMapClick}
        >
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                icon="http://maps.google.com/mapfiles/ms/micons/hiker.png"
              />
              {markers.map((marker) => (
                <Marker key={marker.id} position={{lat:marker.lat, lng:marker.lng}} onClick={()=>handleMarkerClick(marker.id)} />
              ))}
              {markers.length >= 2 && (
                <Polyline
                  path={markers}
                  options={{
                    strokeColor: "#FF5733",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
      )}
    </div>
  );
};
