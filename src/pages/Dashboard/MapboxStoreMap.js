import { useEffect, useState, useMemo } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxClusterLayer from './MapboxClusterLayer';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';

import { MAPBOX_CONFIG } from '../../config/mapConfig';
import './styles/MapboxStoreMap.css';



const PAKISTAN_REGIONS = {
  'Sindh': {
    latitude: 26.0,
    longitude: 68.5,
    zoom: 7
  },
  'Balochistan': {
    latitude: 28.5,
    longitude: 65.5,
    zoom: 6.5
  },
  'Punjab': {
    latitude: 31.5,
    longitude: 72.5,
    zoom: 6.8
  },
  'Khyber Pakhtunkhwa': {
    latitude: 34.5,
    longitude: 71.5,
    zoom: 7
  },
  'Gilgit-Baltistan': {
    latitude: 35.8,
    longitude: 74.5,
    zoom: 7.2
  },
  'Azad Kashmir': {
    latitude: 33.9,
    longitude: 73.8,
    zoom: 8
  }
};

const MapboxStoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);
  const [popupInfo, setPopupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
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

    if (propStores && propStores.length > 0) {
      const bounds = propStores.reduce(
        (acc, store) => ({
          minLng: Math.min(acc.minLng, store.longitude),
          maxLng: Math.max(acc.maxLng, store.longitude),
          minLat: Math.min(acc.minLat, store.latitude),
          maxLat: Math.max(acc.maxLat, store.latitude)
        }),
        {
          minLng: propStores[0].longitude,
          maxLng: propStores[0].longitude,
          minLat: propStores[0].latitude,
          maxLat: propStores[0].latitude
        }
      );

      const centerLng = (bounds.minLng + bounds.maxLng) / 2;
      const centerLat = (bounds.minLat + bounds.maxLat) / 2;
      const padding = 50;
      const zoom = Math.min(
        Math.log2(
          360 / (bounds.maxLng - bounds.minLng + padding * 0.00001)
        ),
        Math.log2(
          180 / (bounds.maxLat - bounds.minLat + padding * 0.00001)
        )
      );

      setViewport({
        ...viewport,
        latitude: centerLat,
        longitude: centerLng,
        zoom: Math.min(Math.max(zoom - 0.5, MAPBOX_CONFIG.minZoom), MAPBOX_CONFIG.maxZoom),
        transitionDuration: 1000,
        transitionEasing: t => t * (2 - t)
      });
    }

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

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stores.map(store => store.region))];
    return uniqueRegions.map(region => ({ value: region, label: region }));
  }, [stores]);

  const filteredByRegion = useMemo(() => 
    stores.filter(store => !selectedRegion || store.region === selectedRegion?.value),
    [stores, selectedRegion]
  );

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(filteredByRegion.map(store => store.city))];
    return uniqueCities.map(city => ({ value: city, label: city }));
  }, [filteredByRegion]);

  const filteredByCity = useMemo(() => 
    filteredByRegion.filter(store => !selectedCity || store.city === selectedCity?.value),
    [filteredByRegion, selectedCity]
  );

  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(filteredByCity.map(store => store.area))];
    return uniqueAreas.map(area => ({ value: area, label: area }));
  }, [filteredByCity]);

  const distributors = useMemo(() => {
    const uniqueDistributors = [...new Set(stores.map(store => store.distributor))];
    return uniqueDistributors.map(distributor => ({ value: distributor, label: distributor }));
  }, [stores]);

  const ranks = useMemo(() => {
    const uniqueRanks = [...new Set(stores.map(store => store.rank))];
    return uniqueRanks.map(rank => ({ value: rank, label: rank }));
  }, [stores]);

  const filteredByArea = useMemo(() => 
    filteredByCity.filter(store => !selectedArea || store.area === selectedArea?.value),
    [filteredByCity, selectedArea]
  );

  const filteredByDistributor = useMemo(() => 
    filteredByArea.filter(store => !selectedDistributor || store.distributor === selectedDistributor?.value),
    [filteredByArea, selectedDistributor]
  );

  const filteredStores = useMemo(() => 
    filteredByDistributor.filter(store => !selectedRank || store.rank === selectedRank?.value),
    [filteredByDistributor, selectedRank]
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '69vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleFilterChange = (filterType) => (selectedOption) => {
    switch (filterType) {
      case 'region':
        setSelectedRegion(selectedOption);
        setSelectedCity(null);
        setSelectedArea(null);
        if (selectedOption && PAKISTAN_REGIONS[selectedOption.value]) {
          const regionViewport = PAKISTAN_REGIONS[selectedOption.value];
          setViewport({
            ...viewport,
            latitude: regionViewport.latitude,
            longitude: regionViewport.longitude,
            zoom: regionViewport.zoom,
            transitionDuration: 1000,
            transitionEasing: t => t * (2 - t)
          });
        }
        break;
      case 'city':
        setSelectedCity(selectedOption);
        setSelectedArea(null);
        if (selectedOption) {
          const cityStore = filteredByRegion.find(store => store.city === selectedOption.value);
          if (cityStore) {
            setViewport({
              ...viewport,
              latitude: cityStore.latitude,
              longitude: cityStore.longitude,
              zoom: 11,
              transitionDuration: 1000,
              transitionEasing: t => t * (2 - t)
            });
          }
        }
        break;
      case 'area':
        setSelectedArea(selectedOption);
        break;
      case 'distributor':
        setSelectedDistributor(selectedOption);
        break;
      case 'rank':
        setSelectedRank(selectedOption);
        break;
      default:
        break;
    }
  };

  return (
    <div className="store-map-container">
      <div className="row">
        <div className="col-lg-10">
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
          stores={filteredStores}
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
    <div className="col-lg-2 mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">Total Stores ({filteredStores.length})</h4>
          
          <FormGroup className="mb-3">
            <Label>Region</Label>
            <Select
              value={selectedRegion}
              options={regions}
              className="basic-select"
              classNamePrefix="select"
              onChange={handleFilterChange('region')}
              placeholder="Select Region..."
              isClearable
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>City</Label>
            <Select
              value={selectedCity}
              options={cities}
              className="basic-select"
              classNamePrefix="select"
              onChange={handleFilterChange('city')}
              placeholder="Select City..."
              isClearable
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>Area</Label>
            <Select
              value={selectedArea}
              options={areas}
              className="basic-select"
              classNamePrefix="select"
              onChange={handleFilterChange('area')}
              placeholder="Select Area..."
              isClearable
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>Distributor</Label>
            <Select
              value={selectedDistributor}
              options={distributors}
              className="basic-select"
              classNamePrefix="select"
              onChange={handleFilterChange('distributor')}
              placeholder="Select Distributor..."
              isClearable
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label>Rank</Label>
            <Select
              value={selectedRank}
              options={ranks}
              className="basic-select"
              classNamePrefix="select"
              onChange={handleFilterChange('rank')}
              placeholder="Select Rank..."
              isClearable
            />
          </FormGroup>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default MapboxStoreMap;