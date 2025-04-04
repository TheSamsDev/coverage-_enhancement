import { useEffect, useState, useMemo } from "react";
import { Map, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxClusterLayer from "./MapboxClusterLayer";
import Select from "react-select";
import { FormGroup, Label, Button, ButtonGroup, Input } from "reactstrap";
import { Box, Typography,Accordion,AccordionDetails ,AccordionSummary} from "@mui/material";

import { MAPBOX_CONFIG } from "../../config/mapConfig";
import "./styles/MapboxStoreMap.css";
import pakistanGeoJSON from "../../assets/pk.json";
import * as turf from "@turf/turf";
const ExpandMoreIcon = () => "▼";

const MapboxStoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);
  const [showStores, setShowStores] = useState(false);
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
    pitch: 0,
  });
  const [dynamicPolygons, setDynamicPolygons] = useState(null);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stores.map((store) => store.region))];
    return uniqueRegions.map((region) => ({ value: region, label: region }));
  }, [stores]);

  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(stores.map((store) => store.area))];
    return uniqueAreas.map((area) => ({ value: area, label: area }));
  }, [stores]);

  const territories = useMemo(() => {
    const uniqueTerritories = [
      ...new Set(stores.map((store) => store.rank)),
    ];
    return uniqueTerritories.map((territory) => ({
      value: territory,
      label: territory,
    }));
  }, [stores]);

  const distributors = useMemo(() => {
    const uniqueDistributors = [
      ...new Set(stores.map((store) => store.distributor)),
    ];
    return uniqueDistributors.map((distributor) => ({
      value: distributor,
      label: distributor,
    }));
  }, [stores]);

  const filteredStores = useMemo(() => {
    if (!showStores) {
      return [];
    }
    return stores.filter((store) => {
      const regionMatch =
        !selectedRegions.length ||
        selectedRegions.some((region) => region.value === store.region);
      const areaMatch =
        !selectedAreas.length ||
        selectedAreas.some((area) => area.value === store.area);
      const territoryMatch =
        !selectedTerritories.length ||
        selectedTerritories.some(
          (territory) => territory.value === store.territory
        );
      const distributorMatch =
        !selectedDistributors.length ||
        selectedDistributors.some(
          (distributor) => distributor.value === store.distributor
        );
      return regionMatch && areaMatch && territoryMatch && distributorMatch;
    });
  }, [
    stores,
    selectedRegions,
    selectedAreas,
    selectedTerritories,
    selectedDistributors,
    showStores,
  ]);

  useEffect(() => {
    setIsLoading(true);
    setStores(propStores || []);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [propStores]);

  useEffect(() => {
    if (!areas || !territories || !distributors) {
      return;
    }

    if (
      !selectedAreas.length &&
      !selectedTerritories.length &&
      !selectedDistributors.length &&
      !selectedFilterType
    ) {
      setDynamicPolygons(null);
      return;
    }

    let entitiesToProcess = [];
    if (selectedFilterType === "area") {
      entitiesToProcess = selectedAreas.length ? selectedAreas : areas;
    } else if (selectedFilterType === "territory") {
      entitiesToProcess = selectedTerritories.length
        ? selectedTerritories
        : territories;
    } else if (selectedFilterType === "distributor") {
      entitiesToProcess = selectedDistributors.length
        ? selectedDistributors
        : distributors;
    } else {
      entitiesToProcess = [];
      if (selectedAreas.length) entitiesToProcess = selectedAreas;
      else if (selectedTerritories.length)
        entitiesToProcess = selectedTerritories;
      else if (selectedDistributors.length)
        entitiesToProcess = selectedDistributors;
    }

    if (entitiesToProcess.length === 0) {
      setDynamicPolygons(null);
      return;
    }

    let filtered = stores.filter((store) => {
      const areaMatch =
        !selectedAreas.length ||
        selectedAreas.some((area) => area.value === store.area);
      const territoryMatch =
        !selectedTerritories.length ||
        selectedTerritories.some(
          (territory) => territory.value === store.territory
        );
      const distributorMatch =
        !selectedDistributors.length ||
        selectedDistributors.some(
          (distributor) => distributor.value === store.distributor
        );
      return areaMatch && territoryMatch && distributorMatch;
    });

    if (selectedRegions.length) {
      filtered = filtered.filter((store) =>
        selectedRegions.some((region) => region.value === store.region)
      );
    }

    const storesByRegion = filtered.reduce((acc, store) => {
      const region = store.region;
      if (!acc[region]) acc[region] = [];
      acc[region].push(store);
      return acc;
    }, {});

    const polygons = [];
    Object.keys(storesByRegion).forEach((region) => {
      const regionStores = storesByRegion[region];
      const points = regionStores
        .filter((store) => store.latitude && store.longitude)
        .map((store) => turf.point([store.longitude, store.latitude]));

      if (points.length >= 3) {
        const pointCollection = turf.featureCollection(points);
        const hull = turf.convex(pointCollection);
        if (hull) {
          hull.properties = { region };
          polygons.push(hull);
        }
      }
    });

    if (polygons.length > 0) {
      setDynamicPolygons(turf.featureCollection(polygons));
    } else {
      setDynamicPolygons(null);
    }
  }, [
    selectedAreas,
    selectedTerritories,
    selectedDistributors,
    selectedFilterType,
    selectedRegions,
    stores,
    areas,
    territories,
    distributors,
  ]);

  const handleFilterTypeChange = (filterType) => {
    setSelectedFilterType(filterType);
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
  };

  const handleFilterChange = (filterType) => (selectedOptions) => {
    const options = selectedOptions || [];
    switch (filterType) {
      case "region":
        setSelectedRegions(options);
        break;
      case "area":
        setSelectedAreas(options);
        break;
      case "territory":
        setSelectedTerritories(options);
        break;
      case "distributor":
        setSelectedDistributors(options);
        break;
      default:
        break;
    }
  };

  const handleResetAll = () => {
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setSelectedFilterType(null);
    setShowStores(false);
    setDynamicPolygons(null);
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleResetFilters = () => {
    setSelectedFilterType(null);
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setShowStores(false);
    setDynamicPolygons(null);
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleLoadCMD = () => {
    console.log("Load CMD clicked");
  };

  const provinceLayerStyle = {
    id: "provinces-fill",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": "#808080",
      "fill-opacity": 0.5,
    },
    filter:
      selectedFilterType === "region"
        ? selectedRegions.length
          ? ["!in", "name", ...selectedRegions.map((region) => region.value)]
          : ["==", "name", ""]
        : ["!=", "name", ""],
  };

  const provinceOutlineStyle = {
    id: "provinces-outline",
    type: "line",
    source: "pakistan-provinces",
    paint: {
      "line-color": "#000000",
      "line-width": 1,
    },
  };

  const allRegionsHighlightStyle = {
    id: "all-regions-highlight",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": "#90EE90",
      "fill-opacity": 0.6,
    },
    filter:
      selectedFilterType === "region" && !selectedRegions.length
        ? ["!=", "name", ""]
        : ["==", "name", ""],
  };

  const highlightedRegionStyle = {
    id: "highlighted-region",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": [
        "match",
        ["get", "name"],
        "Sindh",
        "#A1CFF0",
        "Balochistan",
        "#F4A8A8",
        "Punjab",
        "#B8D8B8",
        "Khyber Pakhtunkhwa",
        "#C8B8D8",
        "#CCCCCC",
      ],
      "fill-opacity": 0.6,
    },
    filter: selectedRegions.length
      ? ["in", "name", ...selectedRegions.map((region) => region.value)]
      : ["in", "name", ""],
  };

  const dynamicPolygonStyle = {
    id: "dynamic-polygon",
    type: "fill",
    source: "dynamic-polygons",
    paint: {
      "fill-color": "#8B0000",
      "fill-opacity": 0.6,
    },
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "69vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
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
                onChange={handleFilterChange("region")}
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
                onChange={handleFilterChange("area")}
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
                onChange={handleFilterChange("territory")}
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
                onChange={handleFilterChange("distributor")}
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
                checked={selectedFilterType === "region"}
                onChange={() => handleFilterTypeChange("region")}
              />
              <Label check>Region</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "area"}
                onChange={() => handleFilterTypeChange("area")}
              />
              <Label check>Area</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "territory"}
                onChange={() => handleFilterTypeChange("territory")}
              />
              <Label check>Territory</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "distributor"}
                onChange={() => handleFilterTypeChange("distributor")}
              />
              <Label check>Distributor</Label>
            </FormGroup>
            <Button
              color="primary"
              onClick={handleResetFilters}
              className="ms-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="d-flex align-items-center">
          <Button
            color="primary"
            outline={!showStores}
            className="me-2"
            size="sm"
            onClick={() => setShowStores(true)}
          >
            SavTrach Shops
          </Button>
          <Button color="primary" outline size="sm">
            CBL Shops
          </Button>
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
              onMove={(evt) => setViewport(evt.viewState)}
              style={{ width: "100%", height: "100vh" }}
              mapStyle={MAPBOX_CONFIG.mapStyle}
              mapboxAccessToken={MAPBOX_CONFIG.accessToken}
              maxZoom={MAPBOX_CONFIG.maxZoom}
            >
              <Source
                id="pakistan-provinces"
                type="geojson"
                data={pakistanGeoJSON}
              >
                <Layer {...provinceLayerStyle} />
                <Layer {...provinceOutlineStyle} />
                <Layer {...allRegionsHighlightStyle} />
                <Layer {...highlightedRegionStyle} />
              </Source>

              {dynamicPolygons && (
                <Source
                  id="dynamic-polygons"
                  type="geojson"
                  data={dynamicPolygons}
                >
                  <Layer {...dynamicPolygonStyle} />
                </Source>
              )}

              <MapboxClusterLayer stores={filteredStores} />
            </Map>
          </div>
        </div>

        <div className="col-4">
          <div style={{ marginTop: "20px" }}>
            {/* First Accordion: Stats */}
            <Accordion defaultExpanded>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
    aria-controls="panel1a-content"
    id="panel1a-header"
    sx={{
      background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
      color: "white",
    }}
  >
    <Typography sx={{ color: "white", fontWeight: "bold" }}>
      Stats
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {[
      { label: "No of Outlets", value: stores.length },
      { label: "Selected Outlets", value: filteredStores.length }, // Dynamically show selected stores count
      { label: "CBL Shops", value: 0 },
      { label: "CBL Shops Selected", value: 0 },
      { label: "Region Selected", value: selectedRegions.length },
      { label: "Area Selected", value: selectedAreas.length },
    ].map((item, index) => (
      <Box key={index} sx={{ mb: 1 }}>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            padding: "8px 0",
          }}
        >
          <span>{item.label}</span>
          <span>{item.value.toLocaleString()}</span>
        </Typography>
        {/* Show buttons only below the first row */}
        {index === 5 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <ButtonGroup variant="contained">
              <Button color="primary" outline size="sm">
                Show Stats
              </Button>
              <Button color="primary" outline size="sm">
              CBL Outlets
              </Button>
              <Button color="primary" outline size="sm">
                Routes Data
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Box>
    ))}
  </AccordionDetails>
</Accordion>


            {/* Second Accordion: Filters */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "white",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {" "}
                {/* Blue background for details */}
                <Typography>No filters applied</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxStoreMap;
