import { useEffect, useState } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxClusterLayer from './MapboxClusterLayer';

import { MAPBOX_CONFIG } from '../../config/mapConfig';
import './styles/MapboxStoreMap.css';

const getMarkerColor = (type) => {
  switch (type) {
    case 'ACQUIRED':
      return '#1E88E5';
    case 'POTENTIAL':
      return '#E53935';
    default:
      return '#9E9E9E';
  }
};

const MapboxStoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewport, setViewport] = useState({
    latitude: MAPBOX_CONFIG.defaultCenter.lat,
    longitude: MAPBOX_CONFIG.defaultCenter.lng,
    zoom: MAPBOX_CONFIG.defaultZoom,
    bearing: 0,
    pitch: 0
  });

  useEffect(() => {
    setIsLoading(true);
    setStores(propStores || []);
    // Add a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [propStores]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '69vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '69vh' }}>
        <div className="text-muted">No stores found</div>
      </div>
    );
  }

  return (
    <div className="store-map-container">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '69vh' }}
        mapStyle={MAPBOX_CONFIG.mapStyle}
        mapboxAccessToken={MAPBOX_CONFIG.accessToken}
        maxZoom={MAPBOX_CONFIG.maxZoom}
        minZoom={MAPBOX_CONFIG.minZoom}
        maxBounds={[
          [MAPBOX_CONFIG.bounds.west, MAPBOX_CONFIG.bounds.south],
          [MAPBOX_CONFIG.bounds.east, MAPBOX_CONFIG.bounds.north]
        ]}
      >
        <MapboxClusterLayer
          stores={stores}
          onClick={(event) => {
            const feature = event.features[0];
            if (!feature.properties.cluster) {
              const store = {
                id: feature.properties.id,
                type: feature.properties.type,
                region: feature.properties.region,
                city: feature.properties.city,
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0]
              };
              setPopupInfo(store);
            }
          }}
        />

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.latitude}
            longitude={popupInfo.longitude}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <h3>Store #{popupInfo.id}</h3>
              <p><strong>Type:</strong> {popupInfo.type}</p>
              <p><strong>Region:</strong> {popupInfo.region}</p>
              <p><strong>City:</strong> {popupInfo.city}</p>
              <p><strong>Coordinates:</strong> {popupInfo.latitude.toFixed(6)}, {popupInfo.longitude.toFixed(6)}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxStoreMap;