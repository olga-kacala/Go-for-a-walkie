

// import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
// import { useState } from "react";
// import classes from "./Maps.module.css";

// export const Maps = () => {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
//       });
//       const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

//       const [isOpen, setIsOpen] = useState(false);
//       const [infoWindowData, setInfoWindowData] = useState<{ id: number; address: string } | undefined>();
//       const markers = [
//         { address: "Address1", lat: 18.5204, lng: 73.8567 },
//         { address: "Address2", lat: 18.5314, lng: 73.8446 },
//         { address: "Address3", lat: 18.5642, lng: 73.7769 },
//       ];
    
//       const onMapLoad = (map: google.maps.Map) => {
//         setMapRef(map);
//         const bounds = new google.maps.LatLngBounds();
//         markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
//         map.fitBounds(bounds);
//       };
    
//       const handleMarkerClick = (id: number, lat: number, lng: number, address: string) => {
//         mapRef?.panTo({ lat, lng });
//         setInfoWindowData({ id, address });
//         setIsOpen(true);
//       };
//   return (
//     <div className={classes.Map}>
//       {!isLoaded ? (
//         <h1>Loading...</h1>
//       ) : (
//         <GoogleMap
//           mapContainerClassName="map-container"
//           onLoad={onMapLoad}
//           onClick={() => setIsOpen(false)}
//         >
//           {markers.map(({ address, lat, lng }, ind) => (
//             <Marker
//               key={ind}
//               position={{ lat, lng }}
//               onClick={() => {
//                 handleMarkerClick(ind, lat, lng, address);
//               }}
//             >
//               {isOpen && infoWindowData?.id === ind && (
//                 <InfoWindow
//                   onCloseClick={() => {
//                     setIsOpen(false);
//                   }}
//                 >
//                   <h3>{infoWindowData.address}</h3>
//                 </InfoWindow>
//               )}
//             </Marker>
//           ))}
//         </GoogleMap>
//       )}
//     </div>
//   );
// }


import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import classes from "./Maps.module.css";

export const Maps = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  return (
    <div className={classes.Map}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName={classes.mapContainer}
          center={center}
          zoom={10}
        />
      )}
    </div>
  );
};