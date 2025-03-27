import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './styles/StoreMap.css';

const getMarkerIcon = (type) => {
  const iconOptions = {
    ACQUIRED: {
      iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="7" fill="%231E88E5" stroke="white" stroke-width="1"/></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    },
    POTENTIAL: {
      iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="7" fill="%23E53935" stroke="white" stroke-width="1"/></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    },
  }[type] || {
    iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="7" fill="%239E9E9E" stroke="white" stroke-width="1"/></svg>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  };

  return L.icon(iconOptions);
};

const center = {
  lat: 24.8607, // Pakistan
  lng: 67.0011, // Pakistan
};

const StoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);

  useEffect(() => {
    console.log("StoreMap received stores:", propStores);
    setStores(propStores || []);
  }, [propStores]);

  if (!stores || stores.length === 0) {
    return <div>Loading stores...</div>;
  }

//   console.log("`Rendering` markers for stores:", stores);

  return (
    <div className="store-map-container">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        style={{ width: '100%', height: '89vh' }}
        maxZoom={16}
        minZoom={4}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div class="cluster-icon">${count}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(40, 40),
            });
          }}
        >
          {stores.map((store) => {
            console.log(`Rendering marker for store ${store.id}:`, {
              position: [store.latitude, store.longitude],
              icon: getMarkerIcon(store.type),
            });
            return (
              <Marker
                key={store.id}
                position={[store.latitude, store.longitude]}
                icon={getMarkerIcon(store.type)}
              >
                <Popup>
                  <div>
                    <h3>Store #{store.id}</h3>
                    <p><strong>Type:</strong> {store.type}</p>
                    <p><strong>Region:</strong> {store.region}</p>
                    <p><strong>City:</strong> {store.city}</p>
                    <p><strong>Coordinates:</strong> {store.latitude.toFixed(6)}, {store.longitude.toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default StoreMap;