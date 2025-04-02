import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';

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
  const handleMouseEnter = (event) => {
    const feature = event.features[0];
    if (!feature.properties.cluster) {
      event.target.getMap().getCanvas().style.cursor = 'pointer';
      event.target.setFeatureState(
        { source: 'stores', id: feature.id },
        { hover: true }
      );
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

    </>
  );
};

export default MapboxClusterLayer;