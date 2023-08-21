import { GoogleMap, Marker, useLoadScript, Circle } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import classes from "./Maps.module.css";

export const Maps = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  return (
    <div className={classes.Map}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName={classes.mapContainer}
          center={userLocation || { lat: 50.65696776753784, lng: 17.9230121375674 }}
          zoom={10}
        >
          {userLocation && (
           <>
           <Marker
             position={userLocation}
             icon={"http://maps.google.com/mapfiles/ms/micons/hiker.png"}
           />
           <Circle
             center={userLocation}
             radius={500} 
             options={{
               strokeColor: "rgba(255, 110, 159, 1",
               strokeOpacity: 0.8,
               strokeWeight: 10,
               fillColor: "rgba(122, 146, 254, 1)",
               fillOpacity: 0.35,
             }}
           />
         </>
          )}
        </GoogleMap>
      )}
    </div>
  );
};
