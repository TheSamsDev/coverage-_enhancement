import { useEffect, useState, useMemo } from 'react';
import { Map, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxClusterLayer from './MapboxClusterLayer';
import Select from 'react-select';
import { FormGroup, Label, Button, Input } from 'reactstrap';
import { MAPBOX_CONFIG } from '../../config/mapConfig';
import './styles/MapboxStoreMap.css';
import pakistanGeoJSON from '../../assets/pk.json';

const PAKISTAN_REGIONS = {
  'Sindh': { latitude: 26.0, longitude: 68.5, zoom: 7 },
  'Balochistan': { latitude: 28.5, longitude: 65.5, zoom: 6.5 },
  'Punjab': { latitude: 31.5, longitude: 72.5, zoom: 6.8 },
  'Khyber Pakhtunkhwa': { latitude: 34.5, longitude: 71.5, zoom: 7 },
  'Gilgit-Baltistan': { latitude: 35.8, longitude: 74.5, zoom: 7.2 },
  'Azad Kashmir': { latitude: 33.9, longitude: 73.8, zoom: 8 }
};

const MapboxStoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);
  const [showStores, setShowStores] = useState(false); // Default inactive
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState(null);
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

    if (!selectedRegions.length) {
      setViewport({
        latitude: MAPBOX_CONFIG.defaultCenter.lat,
        longitude: MAPBOX_CONFIG.defaultCenter.lng,
        zoom: MAPBOX_CONFIG.defaultZoom,
        bearing: 0,
        pitch: 0
      });
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [propStores]);

  const handleFilterTypeChange = (filterType) => {
    setSelectedFilterType(filterType);
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0
    });
    // Note: Not resetting showStores here to maintain its state
  };

  const handleClusterClick = () => {};

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stores.map(store => store.region))];
    return uniqueRegions.map(region => ({ value: region, label: region }));
  }, [stores]);

  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(stores.map(store => store.area))];
    return uniqueAreas.map(area => ({ value: area, label: area }));
  }, [stores]);

  const territories = useMemo(() => {
    const uniqueTerritories = [...new Set(stores.map(store => store.territory))];
    return uniqueTerritories.map(territory => ({ value: territory, label: territory }));
  }, [stores]);

  const distributors = useMemo(() => {
    const uniqueDistributors = [...new Set(stores.map(store => store.distributor))];
    return uniqueDistributors.map(distributor => ({ value: distributor, label: distributor }));
  }, [stores]);

  const filteredStores = useMemo(() => {
    if (!showStores) {
      return [];
    }
    if (!selectedRegions.length && !selectedAreas.length && !selectedTerritories.length && !selectedDistributors.length) {
      return stores;
    }
    return stores.filter(store => {
      const regionMatch = !selectedRegions.length || selectedRegions.some(region => region.value === store.region);
      const areaMatch = !selectedAreas.length || selectedAreas.some(area => area.value === store.area);
      const territoryMatch = !selectedTerritories.length || selectedTerritories.some(territory => territory.value === store.territory);
      const distributorMatch = !selectedDistributors.length || selectedDistributors.some(distributor => distributor.value === store.distributor);
      return regionMatch && areaMatch && territoryMatch && distributorMatch;
    });
  }, [stores, selectedRegions, selectedAreas, selectedTerritories, selectedDistributors, showStores]);

  const handleFilterChange = (filterType) => (selectedOptions) => {
    const options = selectedOptions || [];
    switch (filterType) {
      case 'region':
        setSelectedRegions(options);
        break;
      case 'area':
        setSelectedAreas(options);
        break;
      case 'territory':
        setSelectedTerritories(options);
        break;
      case 'distributor':
        setSelectedDistributors(options);
        break;
      default:
        break;
    }
    // Note: Removed setShowStores(false) to maintain button state
  };

  const handleResetAll = () => {
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setSelectedFilterType(null);
    setShowStores(false); // Reset deactivates the button
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0
    });
  };

  const handleResetFilters = () => {
    setSelectedFilterType(null);
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setShowStores(false); // Reset deactivates the button
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0
    });
  };

  const handleLoadCMD = () => {
    console.log("Load CMD clicked");
  };

  const provinceLayerStyle = {
    id: 'provinces-fill',
    type: 'fill',
    source: 'pakistan-provinces',
    paint: {
      'fill-color': '#808080',
      'fill-opacity': 0.5
    }
  };

  const provinceOutlineStyle = {
    id: 'provinces-outline',
    type: 'line',
    source: 'pakistan-provinces',
    paint: {
      'line-color': '#000000',
      'line-width': 1
    }
  };

  const highlightedRegionStyle = {
    id: 'highlighted-region',
    type: 'fill',
    source: 'pakistan-provinces',
    paint: {
      'fill-color': '#0066ff',
      'fill-opacity': 0.6
    },
    filter: selectedFilterType === 'region'
      ? (selectedRegions.length
          ? ['in', 'NAME_1'].concat(selectedRegions.map(region => region.value))
          : ['in', 'NAME_1'].concat(regions.map(region => region.value)))
      : ['in', 'NAME_1', '']
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
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="filter-group me-2">
              <Label>Region</Label>
              <Select
                isMulti
                value={selectedRegions}
                options={regions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange('region')}
                placeholder="Select Region..."
              />
            </div>
            <div className="filter-group me-2">
              <Label>Area</Label>
              <Select
                isMulti
                value={selectedAreas}
                options={areas}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange('area')}
                placeholder="Select Area..."
              />
            </div>
            <div className="filter-group me-2">
              <Label>Territory</Label>
              <Select
                isMulti
                value={selectedTerritories}
                options={territories}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange('territory')}
                placeholder="Select Territory..."
              />
            </div>
            <div className="filter-group">
              <Label>Distributor</Label>
              <Select
                isMulti
                value={selectedDistributors}
                options={distributors}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange('distributor')}
                placeholder="Select Distributor..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === 'region'}
                onChange={() => handleFilterTypeChange('region')}
              />
              <Label check>Region</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === 'area'}
                onChange={() => handleFilterTypeChange('area')}
              />
             COS <Label check>Area</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === 'territory'}
                onChange={() => handleFilterTypeChange('territory')}
              />
              <Label check>Territory</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === 'distributor'}
                onChange={() => handleFilterTypeChange('distributor')}
              />
              <Label check>Distributor</Label>
            </FormGroup>
            <Button color="primary" onClick={handleResetFilters} className="ms-2">
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="d-flex align-items-center">
          <Button 
            color="primary" 
            outline={!showStores} // Outline when inactive
            className="me-2" 
            size="sm" 
            onClick={() => setShowStores(true)}
          >
            SavTrach Shops
          </Button>
          <Button color="primary" outline size="sm">CBL Shops</Button>
        </div>
        <div className="col-12 d-flex justify-content-end">
          <Button color="primary" onClick={handleLoadCMD} className="me-2">
            Unselect All Areas
          </Button>
          <Button color="primary" onClick={handleResetAll}>
             Reset All Sliders
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-8">
          <div className="map-container">
            <Map
              {...viewport}
              onMove={evt => setViewport(evt.viewState)}
              style={{ width: '100%', height: '100vh' }}
              mapStyle={MAPBOX_CONFIG.mapStyle}
              mapboxAccessToken={MAPBOX_CONFIG.accessToken}
              maxZoom={MAPBOX_CONFIG.maxZoom}
            >
              <Source id="pakistan-provinces" type="geojson" data={pakistanGeoJSON}>
                <Layer {...provinceLayerStyle} />
                <Layer {...provinceOutlineStyle} />
                {selectedFilterType === 'region' && <Layer {...highlightedRegionStyle} />}
              </Source>

              <MapboxClusterLayer
                stores={filteredStores}
                onClick={handleClusterClick}
              />
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxStoreMap;