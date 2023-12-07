import {
  GoogleMap,
  Marker,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import classes from "./Maps.module.css";
import { AppContext } from "../Providers/Providers";
import { doc, getDocs, collection, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export type WalkData = {
  id: number;
  username: string;
  walkCreator: string;
  markers: { lat: number; lng: number; id: number }[];
  dateOfWalk: Date | null;
  totalDistance: number;
  addedPets: string[];
};

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
  const [selectedPetNames, setSelectedPetNames] = useState<string[]>([]);
  const [addedPets, setAddedPets] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [publicWalks, setPublicWalks] = useState<WalkData[]>([]);
  const [clickedMarker, setClickedMarker] = useState<{
    lat: number;
    lng: number;
    id: number;
  } | null>(null);
  const [clickedMarkerPosition, setClickedMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    console.log("Map clicked!");
    if (event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          lat,
          lng,
          id: walkData.id,
        },
      ]);
      console.log("Markers:", markers);  
      console.log("dis:", totalDistance); 
      console.log("loc:", userLocation); 
      console.log("startma:", startingMarker);
    }
  };


  const handlePetClick = async () => {
    if (selectedPetNames.length > 0) {
      const uniqueSelectedPetNames = selectedPetNames.filter(
        (petName) => !addedPets.includes(petName)
      );
      setAddedPets((prevPets) => [...prevPets, ...uniqueSelectedPetNames]);
      setSelectedPetNames([]);
    }
  };

  const handleMarkerClick = (markerId: number, walk: WalkData) => {
    console.log("User:", walk.walkCreator);

    if (clickedMarker?.id !== markerId) {
      setClickedMarker(
        markers.find((marker) => marker.id === markerId) || null
      );
      setClickedMarkerPosition({
        lat: walk.markers[0].lat,
        lng: walk.markers[0].lng,
      });
      console.log("marker:", clickedMarker, "position", clickedMarkerPosition);
    } else {
      setClickedMarker(null);
      setClickedMarkerPosition(null);
    }
  };

  const handleDelete = (petName: string) => {
    const updatedAddedPets = addedPets.filter((name) => name !== petName);
    setAddedPets(updatedAddedPets);
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  const walkData: WalkData = {
    id: Date.now(),
    username: `${username}`,
    walkCreator: `${username}`,
    // markers: updatedMarkers,
    markers:markers,
    dateOfWalk: dateOfWalk || null,
    totalDistance,
    addedPets,
  }

  // if (startingMarker) {
  //   walkData.lat = startingMarker.lat;
  //   walkData.lng = startingMarker.lng;
  // }
  

  const handleSaveWalk = async (walkData: WalkData) => {
    if (userLocation && startingMarker && markers.length > 0) {
      // // Update the icon URL for the markers
      // const updatedMarkers = markers.map((marker) => ({
      //   ...marker,
      // }));

      
      
      try {
        const walksCollectionRef = collection(firebaseDb, "Public Walks");
        const walkDocRef = doc(walksCollectionRef, walkData.id.toString());

        await setDoc(walkDocRef, { ...walkData });
        setStartingMarker(null);
        setMarkers([]);
        setTotalDistance(0);
        setAddedPets([]);
        setDateOfWalk(null);
        setSelectedTime(new Date());
      } catch (error) {
        console.log("Error saving walk:", error);
      }
    }
  };

  useEffect(() => {
    const fetchPublicWalks = async () => {
      try {
        const walksCollectionRef = collection(firebaseDb, "Public Walks");
        const walksSnapshot = await getDocs(walksCollectionRef);

        const walks = walksSnapshot.docs.map(
          (walkDoc) => walkDoc.data() as WalkData
        );
        setPublicWalks(walks);
      } catch (error) {
        console.log("Error fetching public walks", error);
      }
    };

    fetchPublicWalks();
  }, []);

  //R E T U R N

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

{/* {publicWalks.map((walk) => (
                <React.Fragment key={`walk-${walk.id}`}> */}

              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
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
                    strokeWeight: 5,
                  }}
                />
              )}
              {totalDistance > 0 && (
                <div className={classes.distance}>
                  <p>Walking Distance: {totalDistance.toFixed(2)} km</p>
                  <p>Pick:</p>
                  <DatePicker
                    className={classes.walksContainer}
                    selected={dateOfWalk}
                    placeholderText="Date"
                    showYearDropdown
                    dateFormat="d MMMM yyyy"
                    onChange={(date) => setDateOfWalk(date as Date)}
                    value={dateOfWalk ? dateOfWalk.toLocaleDateString() : ""}
                  />
                  <DatePicker
                    className={classes.walksContainer}
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
                        <div key={petName} className={classes.petContainer}>
                          <p className={classes.walksContainer}>{petName}</p>
                          <button
                            className={classes.buttonX}
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
                    className={classes.walksContainer}
                    multiple
                    value={selectedPetNames}
                    onChange={(e) => {
                      const selectedNames = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedPetNames(selectedNames);
                    }}
                    onDoubleClick={handlePetClick}
                  >
                    <option value="">Select a pet</option>
                    {myAnimalsList.map((pet) => (
                      <option key={pet.id} value={pet.name}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                  <div className={classes.saveContainer}>
                    <button
                      className={classes.buttonSave}
                      onClick={() => {
                        handleSaveWalk(walkData);
                      }}

                    >
                      Save
                    </button>
                    <button className={classes.share}>
                      <img
                        className={classes.shareLogo}
                        title="Share"
                        alt="share logo"
                        src={"../../Img/share.png"}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* RENDERING SAVED WALKS ON MAP */}

              {publicWalks.map((walk) => (
                <React.Fragment key={`walk-${walk.id}`}>
                  {/* Render markers */}

                  {Array.isArray(walk.markers) &&
                    walk.markers.map((marker) => (
                      <Marker
                        position={{ lat: marker.lat, lng: marker.lng }}
                        key={`walk-${walk.id}-marker-${marker.id}`}
                        icon={{
                          url:
                            walk.username === username
                              ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                          scaledSize: new window.google.maps.Size(40, 40),
                        }}
                        onClick={() => handleMarkerClick(marker.id, walk)}
                      />
                    ))}

                  {clickedMarkerPosition && (
                    <div className={classes.walkInfo}>
                      <p>User: {walk.walkCreator}</p>
                      <p>km: {walk.totalDistance.toFixed(2)}</p>
                      <p>walkId:{walk.id}</p>
                      <p>marker:</p>
                      <ul>
                        {walk.markers.map((marker) => (
                          <li key={marker.id}>{`id:${marker.id.toFixed(
                            2
                          )}, lat:${marker.lat.toFixed(
                            2
                          )}, lng:${marker.lng.toFixed(2)}`}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Render polyline */}

                  {Array.isArray(walk.markers) && walk.markers.length >= 2 && (
                    <Polyline
                      path={walk.markers.map((marker) => ({
                        lat: marker.lat,
                        lng: marker.lng,
                      }))}
                      key={`walk-${walk.id}-polyline`}
                      options={{
                        strokeColor:
                          walk.username === username
                            ? "rgba(122,146,254,1)"
                            : "red",
                        strokeOpacity: 1,
                        strokeWeight: 3,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
             
            </>
          )}
        </GoogleMap>
      )}
    </div>
  );
};


