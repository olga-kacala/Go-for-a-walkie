import {
  GoogleMap,
  Marker,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import React from "react";
import { useState, useEffect, useContext } from "react";
import classes from "./Maps.module.css";
import { AppContext } from "../Providers/Providers";
import {
  doc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseDb } from "../../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export type WalkData = {
  id: number;
  username: string;
  walkCreator: string;
  markers: { lat: number; lng: number; id: number }[];
  dateOfWalk: Date | null;
  timeOfWalk: Date | null;
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
  const [selectedMarker, setSelectedMarker] = useState<{
    marker: { lat: number; lng: number; id: number };
    walk: WalkData;
  } | null>(null);
  const navigate = useNavigate();

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
    const clickedMarker = walk.markers.find((marker) => marker.id === markerId);
    if (clickedMarker) {
      setSelectedMarker({
        marker: clickedMarker,
        walk: walk,
      });
    } else {
      setSelectedMarker(null);
    }
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  const walkData: WalkData = {
    id: Date.now(),
    username: `${username}`,
    walkCreator: `${username}`,
    markers: markers,
    dateOfWalk: dateOfWalk instanceof Date ? dateOfWalk : null,
    timeOfWalk: selectedTime instanceof Date ? selectedTime : null,
    totalDistance,
    addedPets,
  };

  const handleSaveWalkAndFetch = async () => {
    const walkData: WalkData = {
      id: Date.now(),
      username: `${username}`,
      walkCreator: `${username}`,
      markers: markers,
      dateOfWalk: dateOfWalk instanceof Date ? dateOfWalk : null,
      timeOfWalk: selectedTime instanceof Date ? selectedTime : null,
      totalDistance,
      addedPets,
    };

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
      navigate("/RedirectMaps");
    } catch (error) {
      console.log("Error saving walk:", error);
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

        const currentDate = new Date();

        // Check and delete past walks
        for (const walk of walks) {
          if (
            walk.dateOfWalk &&
            walk.dateOfWalk instanceof Timestamp &&
            walk.dateOfWalk.toDate().setHours(0, 0, 0, 0) <
              currentDate.setHours(0, 0, 0, 0)
          ) {
            // Delete the walk if it's in the past
            const walkDocRef = doc(walksCollectionRef, walk.id.toString());
            await deleteDoc(walkDocRef);
          }
        }

        // Filter walks again after deleting past walks
        const validWalks = walks.filter((walk) => {
          return (
            walk.dateOfWalk &&
            walk.dateOfWalk instanceof Timestamp &&
            walk.dateOfWalk.toDate().setHours(0, 0, 0, 0) >=
              currentDate.setHours(0, 0, 0, 0)
          );
        });

        setPublicWalks(validWalks);
      } catch (error) {
        console.log("Error fetching public walks", error);
      }
    };
    fetchPublicWalks();
  }, []);

  // Functions to render the date from Firebase Timestamp object to JavaScript Date object

  function isDate(value: any): value is Date {
    return value instanceof Date;
  }
  function isTimestamp(value: any): value is Timestamp {
    return value && typeof value.toDate === "function";
  }

  function getDateDisplay(
    dateOfWalk: Date | Timestamp | null | undefined,
    isTime: boolean = false
  ): string {
    if (isDate(dateOfWalk)) {
      return isTime
        ? dateOfWalk.toLocaleTimeString()
        : dateOfWalk.toLocaleDateString();
    } else if (isTimestamp(dateOfWalk)) {
      return isTime
        ? dateOfWalk.toDate().toLocaleTimeString()
        : dateOfWalk.toDate().toLocaleDateString();
    } else {
      return "N/A";
    }
  }

  const CustomOption: React.FC<{ innerProps: any; label: any; data: any }> = ({
    innerProps,
    label,
    data,
  }) => (
    <div {...innerProps}>
      <img
        src={data.photoURL ? data.photoURL : "/Img/profilePic.png"}
        alt={`${data.label} Photo`}
        style={{
          width: "30px",
          height: "30px",
          marginRight: "10px",
          borderRadius: "50%",
        }}
      />
      {label}
    </div>
  );

  //R E T U R N / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /

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
                    selected={dateOfWalk ? dateOfWalk : null}
                    placeholderText="Date"
                    showYearDropdown
                    dateFormat="d MMMM yyyy"
                    minDate={new Date()}
                    onChange={(date) => setDateOfWalk(date as Date)}
                    value={dateOfWalk ? dateOfWalk?.toLocaleDateString() : ""}
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
                  <Select
                    className={classes.walksContainer}
                    isMulti
                    options={myAnimalsList.map((pet) => ({
                      label: `${pet.name} - ${pet.temper} - ${pet.sex}`,
                      value: pet.name,
                      photoURL: pet.photoURL,
                    }))}
                    value={selectedPetNames.map((petName) => ({
                      label: `${petName}`,
                      value: petName,
                      photoURL: myAnimalsList.find(
                        (pet) => pet.name === petName
                      )?.photoURL,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedNames = selectedOptions.map(
                        (opt) => opt.value
                      )
                      setSelectedPetNames(selectedNames);
                    }}
                    onMenuClose={handlePetClick}
                    components={{ Option: CustomOption }}
                  />
                  
                  <div className={classes.saveContainer}>
                    <button
                      className={classes.buttonSave}
                      onClick={() => {
                        handleSaveWalkAndFetch();
                      }}
                    >
                      Save
                    </button>
                    <button className={classes.share}>
                      <img
                        className={classes.shareLogo}
                        title="Share"
                        alt="share logo"
                        src={process.env.PUBLIC_URL + "/Img/share.png"}
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

              {/* {selectedMarker && (
                <div className={classes.walkInfo}>
                  <p>walker: {selectedMarker.walk.walkCreator}</p>
                  <p>
                    distance: {selectedMarker.walk.totalDistance.toFixed(2)} km
                  </p>
                  <p>date: {getDateDisplay(selectedMarker.walk.dateOfWalk)}</p>
                  <p>
                    time: {getDateDisplay(selectedMarker.walk.timeOfWalk, true)}
                  </p>
                  <p>pets:</p>
                  <ul>
                    {selectedMarker.walk.addedPets.map((petName) => (
                      <li key={`${selectedMarker.walk.id}-${petName}`}>
                        {petName}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

{selectedMarker && (
  <div className={classes.walkInfo}>
    <p>walker: {selectedMarker.walk.walkCreator}</p>
    <p>distance: {selectedMarker.walk.totalDistance.toFixed(2)} km</p>
    <p>date: {getDateDisplay(selectedMarker.walk.dateOfWalk)}</p>
    <p>time: {getDateDisplay(selectedMarker.walk.timeOfWalk, true)}</p>
    <p>pets:</p>
    <ul >
      {selectedMarker.walk.addedPets.map((petName) => {
        const pet = myAnimalsList.find((pet) => pet.name === petName);
        return (
          <div className={classes.renderedList}>
            <li key={`${selectedMarker.walk.id}-${petName}`}>
                 {pet && (
              <img
              className={classes.renderedPic}
                src={pet.photoURL ? pet.photoURL : "/Img/profilePic.png"}
                alt={`${pet.name} Photo`}
              />
            )}
            <div>
            <div>
                {petName} - {pet?.temper === 'tiger' ? '🐅' : pet?.temper === 'sloth' ? '🦥' : pet?.temper === 'octopus' ? '🐙' : pet?.temper} - {pet?.sex === 'female' ? '♀️' : pet?.sex === 'male' ? '♂️' : pet?.sex}
              </div>
            </div>
           
       
          </li>
          </div>
          
        );
      })}
    </ul>
  </div>
)}


            </>
          )}
        </GoogleMap>
      )}
    </div>
  );
};
