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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [propStores]);

  const handleClusterClick = (event) => {
    const feature = event.features[0];
    if (!feature.properties.cluster) {
      const store = {
        id: feature.properties.id,
        type: feature.properties.type,
        region: feature.properties.region,
        city: feature.properties.city,
        area: feature.properties.area,
        distributor: feature.properties.distributor,
        rank: feature.properties.rank,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0]
      };
      setPopupInfo(store);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '69vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
          onClick={handleClusterClick}
        />

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.latitude}
            longitude={popupInfo.longitude}
            onClose={() => setPopupInfo(null)}
            className="store-popup"
            closeOnClick={false}
          >
            <div className="store-popup-content p-3">
              <h3 className="store-title mb-3">Store #{popupInfo.id}</h3>
              <div className="store-details">
                <p className="mb-2"><strong>Type:</strong> <span className={`badge bg-${popupInfo.type === 'ACQUIRED' ? 'primary' : 'danger'} ms-2`}>{popupInfo.type}</span></p>
                <p className="mb-2"><strong>Region:</strong> <span className="ms-2">{popupInfo.region}</span></p>
                <p className="mb-2"><strong>City:</strong> <span className="ms-2">{popupInfo.city}</span></p>
                <p className="mb-2"><strong>Area:</strong> <span className="ms-2">{popupInfo.area || 'N/A'}</span></p>
                <p className="mb-2"><strong>Distributor:</strong> <span className="ms-2">{popupInfo.distributor || 'N/A'}</span></p>
                <p className="mb-2"><strong>Rank:</strong> <span className="ms-2">{popupInfo.rank || 'N/A'}</span></p>
                <p className="mb-0"><strong>Coordinates:</strong> <span className="ms-2">{popupInfo.latitude.toFixed(6)}, {popupInfo.longitude.toFixed(6)}</span></p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxStoreMap;