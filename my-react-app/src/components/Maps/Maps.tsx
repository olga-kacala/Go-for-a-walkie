import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import classes from "./Maps.module.css";

export const Maps = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
  });
  const center = useMemo(() => ({ lat: 50.65696776753784, lng: 17.9230121375674 }), []);

  return (
    <div className={classes.Map}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName={classes.mapContainer}
          center={center}
          zoom={10}
        >
        <Marker position={{ lat: 50.65696776753784, lng: 17.9230121375674 }} icon=
        {"http://maps.google.com/mapfiles/ms/micons/hiker.png"}
        />
        </GoogleMap>
      )}
    </div>
  );
};