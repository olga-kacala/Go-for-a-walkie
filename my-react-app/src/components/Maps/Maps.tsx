import {
  GoogleMap,
  Marker,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import React from "react";
import { useState, useEffect, useRef, useContext} from "react";
import classes from "./Maps.module.css";
import { AppContext } from "../Providers/Providers";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { firebaseDb } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "firebase/app";
import "firebase/firestore";


export type WalkData = {
id: string;
markers: number;
lat: number;
lng: number;
}

export const Maps = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
  });

  const { myAnimalsList, username, dateOfWalk, setDateOfWalk } =
    useContext(AppContext);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [startingMarker, setStartingMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markers, setMarkers] = useState<
    { lat: number; lng: number; id: number }[]
  >([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const markerIdCounter = useRef(0);
  const [selectedPetNames, setSelectedPetNames] = useState<string[]>([]);
  const [addedPets, setAddedPets] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [publicWalks, setPublicWalks] = useState<WalkData[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setStartingMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    let distance = 0;

    for (let i = 1; i < markers.length; i++) {
      const prevMarker = markers[i - 1];
      const currMarker = markers[i];
      distance += calculateDistance(
        prevMarker.lat,
        prevMarker.lng,
        currMarker.lat,
        currMarker.lng
      );
    }

    setTotalDistance(distance);
  }, [markers]);

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const latRad1 = (lat1 * Math.PI) / 180;
    const lngRad1 = (lng1 * Math.PI) / 180;
    const latRad2 = (lat2 * Math.PI) / 180;
    const lngRad2 = (lng2 * Math.PI) / 180;

    // Calculate the differences between latitudes and longitudes
    const latDiff = latRad2 - latRad1;
    const lngDiff = lngRad2 - lngRad1;

    // Calculate the Haversine formula
    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(latRad1) *
        Math.cos(latRad2) *
        Math.sin(lngDiff / 2) *
        Math.sin(lngDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = earthRadius * c;
    return distance;
  };

  useEffect(() => {
    let distance = 0;

    for (let i = 1; i < markers.length; i++) {
      const prevMarker = markers[i - 1];
      const currMarker = markers[i];
      distance += calculateDistance(
        prevMarker.lat,
        prevMarker.lng,
        currMarker.lat,
        currMarker.lng
      );
    }
    setTotalDistance(distance);
  }, [markers]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { lat, lng, id: markerIdCounter.current++ },
      ]);
    }
  };

  const handlePetClick = () => {
    if (selectedPetNames.length > 0) {
      const uniqeSelectedPetNames = selectedPetNames.filter(
        (petName) => !addedPets.includes(petName)
      );
      setAddedPets((prevPets) => [...prevPets, ...uniqeSelectedPetNames]);
      setSelectedPetNames([]);
    }
  };

  const handleMarkerClick = (markerId: number) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  };

  const handleDelete = (petName: string) => {
    const updatedAddedPets = addedPets.filter((name) => name !== petName);
    setAddedPets(updatedAddedPets);
  };

  const handleSaveWalk = async () => {
    if (userLocation && startingMarker && markers.length > 0) {
      const walkData = {
        userLocation,
        startingMarker,
        markers,
        totalDistance,
        addedPets,
        dateOfWalk,
        selectedTime,
      };
      try {
        const docRef = doc(firebaseDb, "Walks", `${username}`);
        await setDoc(docRef, walkData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  useEffect(()=> {
const fetchPublicWalks = async ()=>{
  try {
    // const docRef = doc(firebaseDb, "Walks", `${username}`);
    const walksCollectionRef = collection(firebaseDb, "Walks",`${username}` );
    const walksData = await getDocs(walksCollectionRef);
    
walksData.forEach((doc: QueryDocumentSnapshot<WalkData>) => {
  walks.push(doc.data());
});



setPublicWalks(walks)
  }  
  catch (error){
    console.log("Error fetching public walks",error)
  }
};
fetchPublicWalks();
  }, []);

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
          {userLocation && startingMarker && (
            <>
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(marker.id)}
                />
              ))}
              {markers.length >= 2 && (
                <Polyline
                  path={markers.map((marker) => ({
                    lat: marker.lat,
                    lng: marker.lng,
                  }))}
                  options={{
                    strokeColor: "rgba(122,146,254,1)",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                  }}
                />
              )}
              {totalDistance > 0 && (
                <div className={classes.distance}>
                  <p>Walking Distance: {totalDistance.toFixed(2)} km</p>
                  <p>Date:</p>
                  <DatePicker
                    id="date"
                    selected={dateOfWalk}
                    placeholderText="Date"
                    showYearDropdown
                    dateFormat="d MMMM yyyy"
                    onChange={(date) => setDateOfWalk(date as Date)}
                    value={dateOfWalk ? dateOfWalk.toLocaleDateString() : ""}
                  />
                  <DatePicker
                    selected={selectedTime}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    timeCaption="Time"
                  />

                  {selectedPetNames !== null && (
                    <div>
                      {addedPets.map((petName) => (
                        <div key={petName}>
                          <p>Pet: {petName}</p>
                          <button
                            className={classes.button}
                            onClick={() => {
                              handleDelete(petName);
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <select
                    multiple
                    value={selectedPetNames}
                    onChange={(e) => {
                      const selectedNames = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedPetNames(selectedNames);
                    }}
                  >
                    <option value="">Select a pet</option>
                    {myAnimalsList.map((pet) => (
                      <option key={pet.id} value={pet.name}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                  <button className={classes.button} onClick={handlePetClick}>
                    Add Pet
                  </button>
                  <button className={classes.button}>Share</button>
                  <button className={classes.button} onClick={handleSaveWalk}>
                    Save
                  </button>
                </div>
              )}
            </>
          )}

{publicWalks.map((walk) => (
            // Render markers and polylines for each saved walk
            <React.Fragment key={walk.id}>
              {/* Render markers */}
              {walk.markers.map((marker: WalkData) => (

                <Marker
                  position={{ lat: marker.lat, lng: marker.lng }}
                  key={marker.id}
                />
              ))}
              {/* Render polyline */}
              {walk.markers.length >= 2 && (
                <Polyline
                  path={walk.markers.map((marker: WalkData) => ({
                    lat: marker.lat,
                    lng: marker.lng,
                  }))}
                  options={{
                    strokeColor: "rgba(122,146,254,1)",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                  }}
                />
              )}
            </React.Fragment>
          ))}




        </GoogleMap>
      )}
    </div>
  );
};
