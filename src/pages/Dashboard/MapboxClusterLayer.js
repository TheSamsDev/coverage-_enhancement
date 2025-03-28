import { useMemo, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl/mapbox';

const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'stores',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
    ]
  }
};

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'stores',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
};

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'stores',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': ['case',
      ['==', ['get', 'type'], 'ACQUIRED'],
      '#1E88E5',
      '#E53935'
    ],
    'circle-radius': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      12,
      8
    ],
    'circle-stroke-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2,
      1.5
    ],
    'circle-stroke-color': '#fff',
    'circle-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.8,
      1
    ]
  },
  layout: {
    'visibility': 'visible'
  }
};

const MapboxClusterLayer = ({ stores, onClick }) => {
  const [popupInfo, setPopupInfo] = useState(null);
  const handleMouseEnter = (event) => {
    const feature = event.features[0];
    if (!feature.properties.cluster) {
      event.target.getMap().getCanvas().style.cursor = 'pointer';
      event.target.setFeatureState(
        { source: 'stores', id: feature.id },
        { hover: true }
      );
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
      onClick(event);
    }
  };

  const handleMouseLeave = (event) => {
    event.target.getMap().getCanvas().style.cursor = '';
    if (event.features && event.features[0]) {
      event.target.setFeatureState(
        { source: 'stores', id: event.features[0].id },
        { hover: false }
      );
    }
    setPopupInfo(null);
  };

  const points = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: stores.map(store => ({
        type: 'Feature',
        properties: {
          id: store.id,
          type: store.type,
          region: store.region,
          city: store.city,
          ...store
        },
        geometry: {
          type: 'Point',
          coordinates: [store.longitude, store.latitude]
        }
      }))
    }),
    [stores]
  );

  return (
    <>
      <Source
        id="stores"
        type="geojson"
        data={points}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </Source>
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
    </>
  );
};

export default MapboxClusterLayer;