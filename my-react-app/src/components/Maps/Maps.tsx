import {
  GoogleMap,
  Marker,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
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
import { Timestamp, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export type WalkData = {
  id: number;
  username: string;
  walkCreator: string;
  markers: { lat: number; lng: number; id: number }[];
  dateOfWalk: Date | null;
  timeOfWalk: Date | null;
  totalDistance: number;
  addedPets: {
    id: number;
    name: string;
    sex: string;
    temper: string;
    photoURL: string | null;
  }[];
  joiners: {
    id: number;
    name: string;
    sex: string;
    temper: string;
    photoURL: string | null;
    walker: string;
  }[];
  walkActivities: string[];
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
  const [selectedPetIds, setSelectedPetIDs] = useState<number[]>([]);
  const [selectedJoinPet, setSelectedJoinPet] = useState<number[]>([]);
  const [addedPets, setAddedPets] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [publicWalks, setPublicWalks] = useState<WalkData[]>([]);
  const [joinWalk, setJoinWalk] = useState<boolean>(false);
  const [selectedWalk, setSelectedWalk] = useState<WalkData | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedWalkActivities, setSelectedWalkActivities] = useState<
    string[]
  >([]);
  const [sharedURL, setSharedURL] = useState<WalkData | null>(null);
  const [firstMarkerPosition, setFirstMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [selectedMarker, setSelectedMarker] = useState<{
    marker: { lat: number; lng: number; id: number };
    walk: WalkData;
  } | null>(null);
  const navigate = useNavigate();
  const redDotIconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
  const blueDotIconUrl =
    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";

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
    if (selectedPetIds.length > 0) {
      const uniqueSelectedPetIDs = selectedPetIds.filter(
        (petId) => !addedPets.includes(petId)
      );
      setAddedPets((prevPets) => [...prevPets, ...uniqueSelectedPetIDs]);
      setSelectedPetIDs([]);
    }
  };

  const handleMarkerClick = (markerId: number, walk: WalkData) => {
    const clickedMarker = walk.markers.find((marker) => marker.id === markerId);
    if (clickedMarker) {
      setSelectedMarker({
        marker: clickedMarker,
        walk: walk,
      });
      setSelectedWalk(walk);
    } else {
      setSelectedMarker(null);
      setSelectedWalk(null);
    }
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };

  const addedPetsData = addedPets.map((petId) => {
    const pet = myAnimalsList.find((pet) => pet.id === petId);
    return {
      id: petId,
      name: pet?.name || "Unknown",
      temper: pet?.temper || "",
      sex: pet?.sex || "",
      photoURL: pet?.photoURL || null,
    };
  });

  const addedJoinersData = selectedJoinPet.map((petId) => {
    const pet = myAnimalsList.find((pet) => pet.id === petId);
    return {
      id: petId,
      name: pet?.name || "Unknown",
      temper: pet?.temper || "",
      sex: pet?.sex || "",
      photoURL: pet?.photoURL || null,
      walker: username || "",
    };
  });

  const walkData: WalkData = {
    id: Date.now(),
    username: `${username}`,
    walkCreator: `${username}`,
    markers: markers,
    dateOfWalk: dateOfWalk instanceof Date ? dateOfWalk : null,
    timeOfWalk: selectedTime instanceof Date ? selectedTime : null,
    totalDistance,
    addedPets: addedPetsData,
    joiners: addedJoinersData,
    walkActivities: selectedWalkActivities,
  };

  const handleSaveWalkAndFetch = async () => {
    try {
      const walksCollectionRef = collection(firebaseDb, "Public Walks");
      const walkDocRef = doc(walksCollectionRef, walkData.id.toString());

      // Check if the walk already exists
      const walkDoc = await getDoc(walkDocRef);
      if (walkDoc.exists()) {
        // If it exists, update the joiners list
        await updateDoc(walkDocRef, {
          joiners: walkData.joiners,
        });
      } else {
        // If it doesn't exist, create a new document
        await setDoc(walkDocRef, { ...walkData });
      }

      setStartingMarker(null);
      setMarkers([]);
      setTotalDistance(0);
      setAddedPets([]);
      setDateOfWalk(null);
      setSelectedTime(new Date());
      setSelectedJoinPet([]);
      setJoinWalk(false);
      setSelectedWalkActivities([]);
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

        const userCreatedWalks = validWalks.filter(
          (walk) => walk.walkCreator === username && walk.joiners.length > 0
        );

        userCreatedWalks.forEach((walk) => {
          const petNames = walk.joiners.map((pet) => pet.name).join(", ");
          toast.success(
            `Exciting News! ${petNames} will join your walk on ${getDateDisplay(
              walk.dateOfWalk
            )}! 🐾❤️`,
            {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        });
      } catch (error) {
        console.log("Error fetching public walks", error);
      }
    };
    fetchPublicWalks();
  }, [username]);

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
        alt={`${data.label}`}
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

  const handleJoinWalk = (walk: WalkData | null) => {
    if (walk) {
      setSelectedWalk(walk);
      setJoinWalk(true);
    }
  };

  const handleAddJoiners = async () => {
    try {
      if (selectedJoinPet.length > 0 && selectedWalk) {
        const walksCollectionRef = collection(firebaseDb, "Public Walks");
        const walkDocRef = doc(walksCollectionRef, selectedWalk.id.toString());

        // Check if the walk already exists
        const walkDoc = await getDoc(walkDocRef);
        if (walkDoc.exists()) {
          // If it exists, update the joiners list
          const updatedJoiners = [
            ...selectedWalk.joiners,
            ...selectedJoinPet.map((petId) => {
              const pet = myAnimalsList.find((pet) => pet.id === petId);
              return {
                id: petId,
                name: pet?.name || "Unknown",
                temper: pet?.temper || "",
                sex: pet?.sex || "",
                photoURL: pet?.photoURL || null,
                walker: username,
              };
            }),
          ];

          // Update the existing walk with the new joiners
          await updateDoc(walkDocRef, { joiners: updatedJoiners });

          setSelectedJoinPet([]);
          setJoinWalk(false);
          navigate("/RedirectMaps");
        } else {
          console.log("Walk document does not exist.");
        }
      } else {
        console.log(
          "No pets selected to join the walk or selected walk is null"
        );
      }
    } catch (error) {
      console.log("Error adding joiners:", error);
    }
  };

  const handleDeleteWalk = () => {
    const walksCollectionRef = collection(firebaseDb, "Public Walks");
    const walkDocRef = doc(
      walksCollectionRef,
      selectedMarker?.walk.id.toString()
    );
    deleteDoc(walkDocRef);
    navigate("/RedirectMaps");
  };

  const handleShareButtonClick = () => {
    if (selectedWalk) {
      window.open(
        `https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${selectedWalk.id}`,
        "_blank"
      );
    }
  };

  const location = useLocation();
  const walkIdFromParams = location.pathname.split("/").pop();

  useEffect(() => {
    // Check if walkIdFromParams is available
    if (walkIdFromParams) {
      // Find the walk with the matching ID
      const selectedWalk = publicWalks.find(
        (walk) => walk.id.toString() === walkIdFromParams
      );
      const currentURL = location.pathname;
      const originalURL = "/Maps";
      if (currentURL !== originalURL) {
        setSharedURL(selectedWalk || null);
      }
      // If the walk is found, set the first marker position
      if (selectedWalk && selectedWalk.markers.length > 0) {
        const firstMarker = selectedWalk.markers[0];
        setFirstMarkerPosition({
          lat: firstMarker.lat,
          lng: firstMarker.lng,
        });
      }
    }
  }, [walkIdFromParams, publicWalks]);

  useEffect(() => {
    // Update the center when firstMarkerPosition changes
    if (firstMarkerPosition) {
      setCenter({
        lat: firstMarkerPosition.lat,
        lng: firstMarkerPosition.lng,
      });
    }
  }, [firstMarkerPosition]);

  return (
    <div className={classes.Map}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={
            mapContainerRef.current
              ? { width: "100%", height: "100%" }
              : undefined
          }
          mapContainerClassName={classes.mapContainer}
          center={
            center ||
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
                    url: blueDotIconUrl,
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
                    placeholder="Choose Walk Buddy..."
                    options={myAnimalsList.map((pet) => ({
                      label: `${pet.name}`,
                      value: pet.id,
                      photoURL: pet.photoURL,
                    }))}
                    value={selectedPetIds.map((petId) => ({
                      label:
                        myAnimalsList.find((pet) => pet.id === petId)?.name ||
                        "Unknown",
                      value: petId,
                      photoURL: myAnimalsList.find((pet) => pet.id === petId)
                        ?.photoURL,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map(
                        (opt) => opt.value
                      );
                      setSelectedPetIDs(selectedIds);
                    }}
                    onMenuClose={handlePetClick}
                    components={{ Option: CustomOption }}
                  />

                  <Select
                    className={classes.walksContainer}
                    isMulti
                    placeholder="Choose Walk Activities..."
                    options={[
                      { value: "city-walk", label: "🏙️City Walk" },
                      { value: "free-range-walk", label: "🌳Free Range Walk" },
                      { value: "ballie-run", label: "🎾Ballie Run" },
                      { value: "monkey-fun", label: "🐒Monkey Fun" },
                      { value: "swimming", label: "🏊Swimming" },
                      { value: "obstacle-course", label: "🚧Obstacle Course" },
                      { value: "tricks", label: "🎭Tricks" },
                    ]}
                    value={selectedWalkActivities.map((activity) => ({
                      value: activity,
                      label: activity,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedActivities = selectedOptions.map(
                        (opt) => opt.value
                      );
                      setSelectedWalkActivities(selectedActivities);
                    }}
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
                              ? blueDotIconUrl
                              : redDotIconUrl,
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

              {selectedMarker && (
                <div className={classes.walkInfo}>
                  <p>walker: {selectedMarker.walk.walkCreator.split("@")[0]}</p>
                  <p>
                    distance: {selectedMarker.walk.totalDistance.toFixed(2)} km
                  </p>
                  <p>date: {getDateDisplay(selectedMarker.walk.dateOfWalk)}</p>
                  <p>
                    time: {getDateDisplay(selectedMarker.walk.timeOfWalk, true)}
                  </p>

                  <ul>
                    {selectedMarker.walk.addedPets.map((item) => (
                      <li key={item.id}>
                        {item && (
                          <>
                            <img
                              className={classes.renderedPic}
                              src={
                                item.photoURL
                                  ? item.photoURL
                                  : "/Img/profilePic.png"
                              }
                              alt={`${item.name}`}
                            />
                            <div>{item.name}</div>
                            {item?.temper === "tiger"
                              ? "🐅"
                              : item?.temper === "sloth"
                              ? "🦥"
                              : item?.temper === "octopus"
                              ? "🐙"
                              : item?.temper}{" "}
                            {item?.sex === "female"
                              ? "♀️"
                              : item?.sex === "male"
                              ? "♂️"
                              : item?.sex}{" "}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <p>planned activities:</p>
                    <li>
                      {selectedMarker.walk.walkActivities.map(
                        (activitie, index) => (
                          <React.Fragment key={activitie}>
                            {index > 0 && <span> </span>}
                            {activitie && (
                              <>
                                {activitie === "city-walk"
                                  ? "🏙️"
                                  : activitie === "free-range-walk"
                                  ? "🌳"
                                  : activitie === "ballie-run"
                                  ? "🎾"
                                  : activitie === "monkey-fun"
                                  ? "🐒"
                                  : activitie === "swimming"
                                  ? "🏊"
                                  : activitie === "obstacle-course"
                                  ? "🚧"
                                  : activitie === "tricks"
                                  ? "🎭"
                                  : activitie}
                              </>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </li>
                  </ul>

                  <ul>
                    {selectedMarker.walk.joiners.length >= 0 && (
                      <>
                        <p className={classes.joiners}>
                          Fellow Walkers: {selectedMarker.walk.joiners.length}
                        </p>
                        <WhatsappShareButton
                          url={`https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${
                            selectedWalk?.id || ""
                          }`}
                          onClick={handleShareButtonClick}
                        >
                          <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>

                        <TwitterShareButton
                          url={`https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${
                            selectedWalk?.id || ""
                          }`}
                          onClick={handleShareButtonClick}
                        >
                          <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>

                        <FacebookShareButton
                          url={`https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${
                            selectedWalk?.id || ""
                          }`}
                          onClick={handleShareButtonClick}
                        >
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>

                        <LinkedinShareButton
                          url={`https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${
                            selectedWalk?.id || ""
                          }`}
                          onClick={handleShareButtonClick}
                        >
                          <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>

                        <EmailShareButton
                          url={`https://olga-kacala.github.io/Go-for-a-walkie/#/Maps/${
                            selectedWalk?.id || ""
                          }`}
                          onClick={handleShareButtonClick}
                        >
                          <EmailIcon size={32} round={true} />
                        </EmailShareButton>

                        {selectedMarker.walk.joiners.map((pet) => (
                          <li key={pet.id}>
                            {pet && (
                              <>
                                <img
                                  className={classes.renderedPic}
                                  src={
                                    pet.photoURL
                                      ? pet.photoURL
                                      : "/Img/profilePic.png"
                                  }
                                  alt={`${pet.name}`}
                                />
                                <div>{pet.name}</div>
                                {pet?.temper === "tiger"
                                  ? "🐅"
                                  : pet?.temper === "sloth"
                                  ? "🦥"
                                  : pet?.temper === "octopus"
                                  ? "🐙"
                                  : pet?.temper}{" "}
                                {pet?.sex === "female"
                                  ? "♀️"
                                  : pet?.sex === "male"
                                  ? "♂️"
                                  : pet?.sex}{" "}
                                <p>walker: {pet.walker.split("@")[0]}</p>
                              </>
                            )}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  {username !== selectedMarker.walk.walkCreator && (
                    <button
                      className={classes.buttonSave}
                      onClick={() => {
                        handleJoinWalk(selectedMarker?.walk);
                      }}
                    >
                      Join
                    </button>
                  )}
                  {joinWalk && (
                    <>
                      <Select
                        className={classes.joinersSelect}
                        isMulti
                        options={myAnimalsList
                          .filter(
                            (pet) =>
                              !selectedJoinPet.includes(pet.id) &&
                              !selectedMarker?.walk.joiners
                                .map((joiner) => joiner.id)
                                .includes(pet.id)
                          )
                          .map((pet) => ({
                            label: `${pet.name}`,
                            value: pet.id,
                            photoURL: pet.photoURL,
                          }))}
                        value={selectedJoinPet.map((petId) => ({
                          label:
                            myAnimalsList.find((pet) => pet.id === petId)
                              ?.name || "Unknown",
                          value: petId,
                          photoURL: myAnimalsList.find(
                            (pet) => pet.id === petId
                          )?.photoURL,
                        }))}
                        onChange={(selectedOptions) => {
                          const selectedJoiners = selectedOptions.map(
                            (opt) => opt.value
                          );
                          setSelectedJoinPet(selectedJoiners);
                        }}
                        onMenuClose={joinWalk ? handlePetClick : undefined}
                        components={{ Option: CustomOption }}
                      />
                      <div className={classes.saveContainer}>
                        <button
                          className={classes.buttonSave}
                          onClick={() => {
                            handleAddJoiners();
                          }}
                        >
                          Add Pet to walk
                        </button>
                      </div>
                    </>
                  )}

                  {username === selectedMarker.walk.walkCreator && (
                    <button
                      className={classes.buttonSave}
                      onClick={() => {
                        handleDeleteWalk();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}

              {sharedURL && (
                <div className={classes.walkInfo}>
                  <p>walker: {sharedURL.walkCreator.split("@")[0]}</p>
                  <p>distance: {sharedURL.totalDistance.toFixed(2)} km</p>
                  <p>date: {getDateDisplay(sharedURL.dateOfWalk)}</p>
                  <p>time: {getDateDisplay(sharedURL.timeOfWalk, true)}</p>

                  <ul>
                    {sharedURL.addedPets.map((item) => (
                      <li key={item.id}>
                        {item && (
                          <>
                            <img
                              className={classes.renderedPic}
                              src={
                                item.photoURL
                                  ? item.photoURL
                                  : "/Img/profilePic.png"
                              }
                              alt={`${item.name}`}
                            />
                            <div>{item.name}</div>
                            {item?.temper === "tiger"
                              ? "🐅"
                              : item?.temper === "sloth"
                              ? "🦥"
                              : item?.temper === "octopus"
                              ? "🐙"
                              : item?.temper}{" "}
                            {item?.sex === "female"
                              ? "♀️"
                              : item?.sex === "male"
                              ? "♂️"
                              : item?.sex}{" "}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <p>planned activities:</p>
                    <li>
                      {sharedURL.walkActivities.map((activitie, index) => (
                        <React.Fragment key={activitie}>
                          {index > 0 && <span> </span>}
                          {activitie && (
                            <>
                              {activitie === "city-walk"
                                ? "🏙️"
                                : activitie === "free-range-walk"
                                ? "🌳"
                                : activitie === "ballie-run"
                                ? "🎾"
                                : activitie === "monkey-fun"
                                ? "🐒"
                                : activitie === "swimming"
                                ? "🏊"
                                : activitie === "obstacle-course"
                                ? "🚧"
                                : activitie === "tricks"
                                ? "🎭"
                                : activitie}
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </li>
                  </ul>

                  <ul>
                    {sharedURL.joiners.length >= 0 && (
                      <>
                        <p className={classes.joiners}>
                          Fellow Walkers: {sharedURL.joiners.length}
                        </p>

                        {sharedURL.joiners.map((pet) => (
                          <li key={pet.id}>
                            {pet && (
                              <>
                                <img
                                  className={classes.renderedPic}
                                  src={
                                    pet.photoURL
                                      ? pet.photoURL
                                      : "/Img/profilePic.png"
                                  }
                                  alt={`${pet.name}`}
                                />
                                <div>{pet.name}</div>
                                {pet?.temper === "tiger"
                                  ? "🐅"
                                  : pet?.temper === "sloth"
                                  ? "🦥"
                                  : pet?.temper === "octopus"
                                  ? "🐙"
                                  : pet?.temper}{" "}
                                {pet?.sex === "female"
                                  ? "♀️"
                                  : pet?.sex === "male"
                                  ? "♂️"
                                  : pet?.sex}{" "}
                                <p>walker: {pet.walker.split("@")[0]}</p>
                              </>
                            )}
                          </li>
                        ))}
                      </>
                    )}
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
