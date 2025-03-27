import {useMemo } from 'react';
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
    'circle-color': [
      'match',
      ['get', 'type'],
      'ACQUIRED', '#1E88E5',
      'POTENTIAL', '#E53935',
      '#9E9E9E'
    ],
    'circle-radius': 12,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};

const MapboxClusterLayer = ({ stores, onClick }) => {
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
      <Layer {...unclusteredPointLayer} onClick={onClick} />
    </Source>
  );
};

export default MapboxClusterLayer;